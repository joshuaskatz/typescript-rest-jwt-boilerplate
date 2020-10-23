import { NextFunction, Request } from "express";
import { verify } from "jsonwebtoken";
import { AuthPayload } from "../types";

export const isAuth = (req: Request, __: any, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) {
    throw new Error("Not authenticated!");
  }

  try {
    const token: string = auth.split(" ")[1];
    const authPayload = verify(token, process.env.JWT_SECRET) as AuthPayload;
    req.authPayload = authPayload as AuthPayload;
  } catch (err) {
    throw new Error("Not authenticated!");
  }

  next();
};
