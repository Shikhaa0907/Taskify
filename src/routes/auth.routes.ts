import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
} from "../controllers/auth.controller";

const router = Router();

/* ================= AUTH ROUTES ================= */

/**
 * @route   POST /auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /auth/refresh-token
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post("/refresh-token", refreshAccessToken);

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Public (client-side token cleanup)
 */
router.post("/logout", logout);

/* ================= HEALTH CHECK ================= */
router.get("/health", (_req, res) => {
  res.status(200).json({ message: "Auth service is running" });
});

export default router;