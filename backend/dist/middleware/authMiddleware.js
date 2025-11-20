"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = parts[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtSecret);
        if (typeof decoded === "string") {
            return res.status(401).json({ message: "Invalid token" });
        }
        const payload = decoded;
        if (!payload.id || !payload.email || !payload.name) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = payload;
        next();
    }
    catch (error) {
        console.error("Auth middleware error", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
exports.default = exports.authenticate;
//# sourceMappingURL=authMiddleware.js.map