import { Connection } from "mongoose";
import request from "supertest";
import { testConn } from "../../../test-utils/testConn";
import { createServer } from "../../../test-utils/createServer";
import { User, UserDocument } from "../../../models/user";
import { hash } from "bcryptjs";

describe("POST /requestResetPassword & /resetPassword/:id", () => {
  const app = createServer();
  let conn: Connection;
  let user: UserDocument | null;

  beforeAll(async () => {
    conn = await testConn();
    await User.create({
      username: "joshuaskatz",
      email: "joshuaskatz@example.com",
      password: await hash("password", 12),
    });
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Should set a reset token on user", async (done) => {
    await request(app)
      .post("/requestResetPassword")
      .send({ email: "joshuaskatz@example.com" });
    user = await User.findOne({ email: "joshuaskatz@example.com" });
    expect(user!.resetToken).not.toBeNull();
    done();
  });

  it("Should not set a reset token if user doesn't exist", async (done) => {
    const response = await request(app)
      .post("/requestResetPassword")
      .send({ email: "fakeemail@example.com" });
    expect(response.body).toMatchObject({
      message: "User not found",
    });
    done();
  });

  it("Should not reset password if length is too short", async (done) => {
    const response = await request(app)
      .put(`/resetPassword/${user!.resetToken}`)
      .send({ newPassword: "pass" });

    expect(response.body).toMatchObject({
      message: "Password must be at least 8 characters long",
    });
    done();
  });

  it("Should reset password on user", async (done) => {
    const response = await request(app)
      .put(`/resetPassword/${user!.resetToken}`)
      .send({ newPassword: "newPassword" });

    expect(response.body).toMatchObject({
      message: "Successfully reset password",
    });
    done();
  });

  it("Should not reset password if the token is incorrect/expired", async (done) => {
    const response = await request(app)
      .put(`/resetPassword/incorrectToken`)
      .send({ newPassword: "newPassword" });

    expect(response.body).toMatchObject({
      message: "Token either expired or incorrect",
    });
    done();
  });
});
