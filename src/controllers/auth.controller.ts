import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

/* ================= REFRESH TOKEN ================= */
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { userId: number };

    const newAccessToken = generateAccessToken(decoded.userId);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (_req: Request, res: Response) => {
  return res.status(200).json({
    message: "Logged out successfully",
  });
};
