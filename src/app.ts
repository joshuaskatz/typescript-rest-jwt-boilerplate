import express, { Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import authRoute from "./routes/auth";
import usersRoute from "./routes/users";

const app: express.Application = express();

app.use(cors());
app.use((_, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRoute);
app.use(usersRoute);

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("mongooooooooo");
});

export default app;
