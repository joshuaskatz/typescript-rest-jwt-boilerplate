import app from "./app";

const server = app.listen(4000 || process.env.PORT, () =>
  console.log("up up up on 4000")
);

export default server;
