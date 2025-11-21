import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import type { AuthenticatedRequest, JwtUserPayload } from "../types/auth";

/**
 * Middleware to authenticate requests using JWT.
 * Verifies the token from the Authorization header and attaches the user payload to the request.
 * @param {AuthenticatedRequest} req - The Express request object
 * @param {Response} res - The Express response object
 * @param {NextFunction} next - The next middleware function
 * @returns {void}
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with "Bearer "
  // The standard format is "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract the token from the header
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = parts[1]!;

  try {
    // Verify the token using the secret key
    // If the token is invalid or expired, this will throw an error
    const decoded = jwt.verify(token, env.jwtSecret);

    // Ensure the decoded payload is an object, not a string
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Cast the decoded payload to our expected type
    const payload = decoded as Partial<JwtUserPayload>;

    // Validate that the payload contains necessary user information
    if (!payload.id || !payload.email || !payload.name) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach the user information to the request object
    // This allows subsequent route handlers to access the authenticated user's data
    req.user = payload as JwtUserPayload;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Auth middleware error", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;

