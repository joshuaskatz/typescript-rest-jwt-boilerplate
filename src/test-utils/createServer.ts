import express from "express";
import bodyParser from "body-parser";

import authRoute from "../routes/auth";
import usersRoute from "../routes/users";

export const createServer = () => {
  const app: express.Application = express();
  app.use(bodyParser.json());
  app.use(authRoute);
  app.use(usersRoute);
  return app;
};
