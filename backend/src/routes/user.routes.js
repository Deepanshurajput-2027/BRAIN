import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccountDetails,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// ── Protected Routes (verifyJWT guards these) ─────────────────────────────────
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update-profile", verifyJWT, updateAccountDetails);

export default router;
