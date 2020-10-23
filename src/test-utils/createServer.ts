import express from "express";
import bodyParser from "body-parser";

import authRoute from "../routes/auth";

export const createServer = () => {
  const app: express.Application = express();
  app.use(bodyParser.json());
  app.use(authRoute);
  return app;
};
