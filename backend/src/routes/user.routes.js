import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

// ── Protected Routes (verifyJWT guards these) ─────────────────────────────────
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update-profile", verifyJWT, updateAccountDetails);
router.post("/send-verification", verifyJWT, sendVerificationEmail);

export default router;
