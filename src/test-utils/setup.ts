import { testConn } from "./testConn";

testConn()
  .then(() => {
    process.exit();
  })
  .catch((err) => console.log(err));
