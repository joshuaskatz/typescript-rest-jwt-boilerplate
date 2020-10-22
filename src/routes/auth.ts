import express from "express";

import * as authController from "../controllers/auth";

const router: express.Router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
