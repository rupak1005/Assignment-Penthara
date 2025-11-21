import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { query } from "../config/database";
import env from "../config/env";
import { type JwtUserPayload } from "../types/auth";

interface DbUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface PublicUser {
  id: string;
  name: string;
  email: string;
}

// Helper to normalize email addresses to lowercase and trimmed
const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Helper to create a signed JWT token for a user
const createToken = (user: JwtUserPayload) =>
  jwt.sign(user, env.jwtSecret, { expiresIn: "7d" });

/**
 * Registers a new user.
 * Validates input, checks for existing email, hashes password, and creates user.
 * @param {Request} req - Express request object containing name, email, and password in body
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON response with user data and token or error message
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    const cleanEmail = normalizeEmail(email);

    // Check if user already exists
    const existing = await query<DbUser>("SELECT id FROM users WHERE email = $1", [
      cleanEmail,
    ]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert new user into database
    const inserted = await query<PublicUser>(
      `INSERT INTO users (id, name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email`,
      [userId, name.trim(), cleanEmail, hashedPassword]
    );

    const user = inserted.rows[0];
    if (!user) {
      return res.status(500).json({ message: "Failed to create account" });
    }

    // Generate JWT token
    const token = createToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Register error", error);
    return res.status(500).json({ message: "Failed to create account" });
  }
};

/**
 * Authenticates a user.
 * Verifies email and password, and returns a JWT token if successful.
 * @param {Request} req - Express request object containing email and password
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON response with user data and token or error message
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const cleanEmail = normalizeEmail(email);

    // Find user by email
    const result = await query<DbUser>("SELECT * FROM users WHERE email = $1", [
      cleanEmail,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create user payload for token
    const payload: JwtUserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = createToken(payload);

    return res.status(200).json({ user: payload, token });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

/**
 * Retrieves current authenticated user's details.
 * Uses the token from the Authorization header.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON response with user data
 */
export const me = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = parts[1]!;
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const payload = decoded as Partial<JwtUserPayload>;
    if (!payload.id || !payload.email || !payload.name) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({ user: payload as JwtUserPayload });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

