import { Connection } from "mongoose";
import request from "supertest";
import { testConn } from "../../../test-utils/testConn";
import { createServer } from "../../../test-utils/createServer";
import { User, UserDocument } from "../../../models/user";
import { hash } from "bcryptjs";

describe("POST /login", () => {
  const app = createServer();
  let conn: Connection;
  let user: UserDocument;

  beforeAll(async () => {
    conn = await testConn();
    user = await User.create({
      username: "edward ",
      email: "ed@example.com",
      password: await hash("password", 12),
    });
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Should login a user", async (done) => {
    const body = {
      username: user.username,
      password: "password",
    };

    const response = await request(app).post("/login").send(body);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.username).toBe(body.username);
    done();
  });

  it("Should not login user if the user does not exist", async (done) => {
    const body = {
      username: "fakeuser",
      password: "user",
    };

    const response = await request(app).post("/login").send(body);
    expect(response.body).toMatchObject({
      message: "Username/Password don't match",
    });
    done();
  });

  it("Should not login user if the user does not exist", async (done) => {
    const body = {
      username: "edward",
      password: "incorrectpassword",
    };

    const response = await request(app).post("/login").send(body);
    expect(response.body).toMatchObject({
      message: "Username/Password don't match",
    });
    done();
  });
});
