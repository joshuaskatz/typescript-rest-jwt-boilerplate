import mongoose, { Document } from "mongoose";

interface UserInterface {
  _id: string;
  username: string;
  email: string;
  password: string;
  resetToken?: string | null;
}

export type UserDocument = UserInterface & Document;

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    default: null,
    expires: "60m",
  },
});

export const User = mongoose.model<UserDocument>("User", userSchema);
