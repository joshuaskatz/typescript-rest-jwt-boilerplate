import mongoose from "mongoose";
import { User } from "../models/user";
import { createServer } from "./createServer";

export const testConn = async () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: true,
    })
    .then((db) => {
      db.connection.dropDatabase();
      User.createIndexes();
      const app = createServer();
      if (process.env.NODE_ENV !== "test") {
        app.listen(5000, () => {
          console.log("Test server up");
        });
      }
    });

  const db = mongoose.connection;

  return db;
};
