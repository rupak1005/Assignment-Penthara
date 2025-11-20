import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import type { AuthenticatedRequest, JwtUserPayload } from "../types/auth";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = parts[1]!;

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const payload = decoded as Partial<JwtUserPayload>;
    if (!payload.id || !payload.email || !payload.name) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = payload as JwtUserPayload;
    next();
  } catch (error) {
    console.error("Auth middleware error", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;

