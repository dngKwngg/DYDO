import express from "express";

import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import authController from "../controllers/authController.js";

const router = express.Router();
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.verifyOtpAndResetPassword);
router.post("/refresh-token", verifyRefreshToken, authController.refreshToken);
export default router;