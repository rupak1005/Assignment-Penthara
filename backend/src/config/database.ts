import { Pool, type QueryResultRow } from "pg";
import env from "./env";

const shouldUseSSL =
  env.databaseUrl?.includes("sslmode=require") ||
  env.databaseUrl?.startsWith("postgresql://");

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: shouldUseSSL
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});

export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
) => pool.query<T>(text, params);

export const initDb = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
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

export default pool;

