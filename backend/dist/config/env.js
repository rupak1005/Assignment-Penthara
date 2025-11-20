"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEFAULT_DATABASE_URL = "postgresql://neondb_owner:npg_SGd9sOJjc6PT@ep-royal-bread-adth4ul1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const corsOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? ["http://localhost:5173"];
exports.env = {
    port: Number(process.env.PORT) || 4000,
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || "development-secret",
    corsOrigins,
};
exports.default = exports.env;
//# sourceMappingURL=env.js.map