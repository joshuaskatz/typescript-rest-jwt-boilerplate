export interface ResponseError {
  message: string;
}

export interface AuthPayload {
  userId: string;
  iat: number;
  exp: number;
}

export interface UserInterface {
  _id: string;
  username: string;
  email: string;
  password: string;
  resetToken?: string | null;
}
