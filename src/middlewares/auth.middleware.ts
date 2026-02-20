import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/* Extend Request type safely */
interface AuthPayload extends JwtPayload {
  userId: number;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("ACCESS_TOKEN_SECRET is not set ❌");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as AuthPayload;

    /* Attach user info to request */
    (req as any).user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR ❌", error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};