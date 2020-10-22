import { Request, Response } from "express";
import { User, UserDocument, UserRoles } from "../models/user";
import { compare, hash } from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { ResponseError } from "./users";
import { v4 as uuid4 } from "uuid";
import { mailToken } from "../utils/mailToken";

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
    .catch(
      (): Response<ResponseError> => {
        return res.send({
          message: "Username/Password don't match",
        });
      }
    );
};

export const requestResetPassword = (req: Request, res: Response) => {
  const { email } = req.body;
  const token: string = uuid4();

  User.findOneAndUpdate({ email }, { resetToken: token })
    .then(
      async (
        user: UserDocument | null
      ): Promise<void | Response<ResponseError>> => {
        if (!user) {
          //We don't want to let the user know if the email belongs to a user, to prevent malicious attacks.
          return res.send({
            message:
              "Please check your email for the link to reset your password",
          });
        }
        await mailToken(token, user?.email as string);
        return res.send({
          message:
            "Please check your email for the link to reset your password",
        });
      }
    )
    .catch((e) => console.log(e));
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  const hashedPassword = await hash(newPassword, 12);

  User.findOneAndUpdate(
    { resetToken: token },
    { password: hashedPassword, resetToken: null }
  )
    .then(
      (user: UserDocument | null): Response<ResponseError> => {
        if (!user) {
          return res.send({
            message: "Token either expired or incorrect",
          });
        }
        return res.send({
          message: "Successfully reset password",
        });
      }
    )
    .catch((e) => console.log(e));
};
