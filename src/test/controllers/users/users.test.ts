import { Connection } from "mongoose";
import request from "supertest";
import { User, UserDocument } from "../../../models/user";
import { testConn } from "../../../test-utils/testConn";
import { createServer } from "../../../test-utils/createServer";
import { generateToken } from "../../../utils/generateToken";

describe("GET /getUsers, /getUser, & /getMe", () => {
  const app = createServer();
  let conn: Connection;
  let users: UserDocument[];
  let user1: UserDocument;
  let user2: UserDocument;

  beforeAll(async () => {
    conn = await testConn();
    user1 = await User.create({
      username: "testuser1",
      email: "test1@example.com",
      password: "password",
    });
    user2 = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password",
    });
    //Route '/getUsers' returns all users but the one querying
    users = await User.find().where("_id").ne(user1._id);
  });

  afterAll(async () => {
    await conn.close();
  });

  it("Should fetch all users", async (done) => {
    const token = generateToken(user1._id);
    const response = await request(app)
      .get("/getUsers")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.length).toEqual(users.length);
    done();
  });

  it("Should not fetch all users if not authorized", async (done) => {
    const response = await request(app).get("/getUsers");
    expect(response.status).toEqual(500);
    done();
  });

  it("Should fetch a single user", async (done) => {
    const token = generateToken(user2._id);
    const response = await request(app)
      .get(`/getUser/${user1.username}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.email).toEqual(user1.email);
    expect(response.body.username).toEqual(user1.username);
    done();
  });

  it("Should not fetch if user does not exist", async (done) => {
    const token = generateToken(user2._id);
    const response = await request(app)
      .get("/getUser/fakeuser")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toMatchObject({
      message: "Unable to fetch user",
    });
    done();
  });

  it("Should not fetch a single user if not authorized", async (done) => {
    const response = await request(app).get(`/getUser/${user1.username}`);
    expect(response.status).toEqual(500);
    done();
  });

  it("Should fetch a user's own info", async (done) => {
    const token = generateToken(user1._id);
    const response = await request(app)
      .get("/getMe")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.email).toEqual(user1.email);
    expect(response.body.username).toEqual(user1.username);
    done();
  });

  it("Should not fetch a user's own info if not authorized", async (done) => {
    const response = await request(app).get("/getMe");
    expect(response.status).toEqual(500);
    done();
  });
});
