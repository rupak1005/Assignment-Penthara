"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = __importDefault(require("./env"));
const shouldUseSSL = env_1.default.databaseUrl.includes("sslmode=require") ||
    env_1.default.databaseUrl.startsWith("postgresql://");
exports.pool = new pg_1.Pool({
    connectionString: env_1.default.databaseUrl,
    ssl: shouldUseSSL
        ? {
            rejectUnauthorized: false,
        }
        : undefined,
});
const query = (text, params) => exports.pool.query(text, params);
exports.query = query;
const initDb = async () => {
    await (0, exports.query)(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
    await (0, exports.query)(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      due_date DATE,
      priority TEXT NOT NULL DEFAULT 'medium',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};
exports.initDb = initDb;
exports.default = exports.pool;
//# sourceMappingURL=database.js.map