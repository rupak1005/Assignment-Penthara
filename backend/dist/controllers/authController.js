"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const database_1 = require("../config/database");
const env_1 = __importDefault(require("../config/env"));
const normalizeEmail = (email) => email.trim().toLowerCase();
const createToken = (user) => jsonwebtoken_1.default.sign(user, env_1.default.jwtSecret, { expiresIn: "7d" });
/**
 * Creates a brand-new account.
 *
 * 1. Normalizes the email so uniqueness checks are case-insensitive.
 * 2. Hashes the password with bcrypt (cost 10 keeps things snappy for demos).
 * 3. Inserts the user and returns a signed JWT so the frontend can persist a session.
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password required" });
        }
        const cleanEmail = normalizeEmail(email);
        const existing = await (0, database_1.query)("SELECT id FROM users WHERE email = $1", [
            cleanEmail,
        ]);
        if (existing.rowCount && existing.rowCount > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)();
        const inserted = await (0, database_1.query)(`INSERT INTO users (id, name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email`, [userId, name.trim(), cleanEmail, hashedPassword]);
        const user = inserted.rows[0];
        if (!user) {
            return res.status(500).json({ message: "Failed to create account" });
        }
        const token = createToken(user);
        return res.status(201).json({ user, token });
    }
    catch (error) {
        console.error("Register error", error);
        return res.status(500).json({ message: "Failed to create account" });
    }
};
exports.register = register;
/**
 * Authenticates an existing user via email + password.
 *
 * We purposefully return the same error for "email not found" and "wrong password"
 * to avoid leaking which accounts exist. The JWT stores just enough fields for the UI.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const cleanEmail = normalizeEmail(email);
        const result = await (0, database_1.query)("SELECT * FROM users WHERE email = $1", [
            cleanEmail,
        ]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = createToken(payload);
        return res.status(200).json({ user: payload, token });
    }
    catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ message: "Failed to login" });
    }
};
exports.login = login;
/**
 * Lightweight profile endpoint used by the frontend to hydrate the current session.
 * Reads the bearer token, verifies it, and echoes the payload back.
 */
const me = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = parts[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtSecret);
        if (typeof decoded === "string") {
            return res.status(401).json({ message: "Invalid token" });
        }
        const payload = decoded;
        if (!payload.id || !payload.email || !payload.name) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(200).json({ user: payload });
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.me = me;
//# sourceMappingURL=authController.js.map