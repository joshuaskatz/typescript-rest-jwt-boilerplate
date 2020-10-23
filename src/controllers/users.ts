import { Request, Response } from "express";
import { ResponseError } from "../types";
import { User, UserDocument } from "../models/user";

export const getUsers = (req: Request, res: Response) => {
  const { userId } = req.authPayload;
  User.find()
    .where("_id")
    .ne(userId)
    .then(
      (users: UserDocument[]): Response<UserDocument[] | ResponseError> => {
        if (!users) {
          return res.send({
            message: "Unable to fetch users",
          });
        }
        return res.json(users);
      }
    )
    .catch((e) => console.log(e));
};

export const getUser = (req: Request, res: Response) => {
  const { username } = req.params;
  User.findOne({ username })
    .then(
      (user: UserDocument | null): Response<UserDocument | ResponseError> => {
        if (!user) {
          return res.send({
            message: "Unable to fetch user",
          });
        }
        return res.json(user);
      }
    )
    .catch((e) => console.log(e));
};

export const getMe = (req: Request, res: Response) => {
  const { userId } = req.authPayload;
  User.findById(userId)
    .then(
      (user: UserDocument | null): Response<UserDocument | ResponseError> => {
        if (!user) {
          return res.send({
            message: "Unable to fetch user",
          });
        }
        return res.json(user);
      }
    )
    .catch((e) => console.log(e));
};
