import express from "express";

import * as authController from "../controllers/auth";

const router: express.Router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/requestResetPassword", authController.requestResetPassword);
router.put("/resetPassword/:token", authController.resetPassword);

export default router;
