import { Request, Response } from "express";
import { User, UserDocument, UserRoles } from "../models/user";
import { compare, hash } from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { ResponseError } from "./users";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (username.length < 6) {
    throw new Error("Username must be at least 6 characters");
  }
  if (!email.includes("@")) {
    throw new Error("Please enter a valid email");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const hashedPassword = await hash(password, 12);

  User.create({
    username,
    email,
    password: hashedPassword,
    userRole: UserRoles.BUYER,
  })
    .then((user: UserDocument): Response<UserDocument> => res.json(user))
    .catch(
      (e: any): Response<ResponseError> => {
        return res.send({
          message:
            e.name === "MongoError" &&
            e.code === 11000 &&
            "Email and/or username already in use!",
        });
      }
    );
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(
      async (
        user: UserDocument | null
      ): Promise<void | Response<UserDocument | ResponseError>> => {
        const dehashedPassword: boolean = await compare(
          password,
          user?.password as string
        );
        if (!user || !dehashedPassword) {
          return res.send({
            message: "Username/Password don't match",
          });
        }
        const token: string = generateToken(user?._id);
        res.setHeader("Authorization", `Bearer ${token}`);
        return res.json(user);
      }
    )
    .catch((e) => console.log(e));
};
