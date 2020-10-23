import { Connection } from "mongoose";
import { createServer } from "../../../test-utils/createServer";
import request from "supertest";
import { testConn } from "../../../test-utils/testConn";
import { User, UserDocument } from "../../../models/user";

describe("POST /register", () => {
  const app = createServer();
  let conn: Connection;
  let user: UserDocument;

  beforeAll(async () => {
    conn = await testConn();
    user = await User.create({
      username: "jacobkatz",
      email: "jacob@example.com",
      password: "password",
    });
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Should register a new user", async (done) => {
    const body = {
      username: "joshuaskatz",
      email: "josh@example.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(body);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.username).toBe(body.username);
    expect(response.body.email).toBe(body.email);
    done();
  });

  it("Should not register a user if username is in use", async (done) => {
    const body = {
      username: user.username,
      email: "jake@example.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(body);
    expect(response.body).toMatchObject({
      message: "Email and/or username already in use!",
    });
    done();
  });

  it("Should not register a user if email is in use", async (done) => {
    const body = {
      username: "jakekatz",
      email: user.email,
      password: "password",
    };
    const response = await request(app).post("/register").send(body);
    expect(response.body).toMatchObject({
      message: "Email and/or username already in use!",
    });
    done();
  });

  it("Should not register a user if email is invalid", async () => {
    const body = {
      username: "joshuakatz1",
      email: "joshexample.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(body);

    expect(response.body).toMatchObject({
      message: "Please enter a valid email",
    });
  });

  it("Should not register a user if username is too short", async () => {
    const body = {
      username: "josh",
      email: "josh@example.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(body);

    expect(response.body).toMatchObject({
      message: "Username must be at least 6 characters long",
    });
  });

  it("Should not register a user if password is too short", async () => {
    const body = {
      username: "joshuakatz1",
      email: "josh@example.com",
      password: "pass",
    };
    const response = await request(app).post("/register").send(body);

    expect(response.body).toMatchObject({
      message: "Password must be at least 8 characters long",
    });
  });
});
