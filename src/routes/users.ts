import express from "express";
import { isAuth } from "../middleware/isAuth";

import * as userController from "../controllers/users";

const router: express.Router = express.Router();

router.get("/getUsers", isAuth, userController.getUsers);
router.get("/getUser/:username", isAuth, userController.getUser);
router.get("/getMe", isAuth, userController.getMe);

export default router;
