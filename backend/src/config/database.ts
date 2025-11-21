import { Pool, type QueryResultRow } from "pg";
import env from "./env";

// Determine if SSL should be used for the database connection
// This is often required for production databases (like on Render or Heroku)
const shouldUseSSL =
  env.databaseUrl?.includes("sslmode=require") ||
  env.databaseUrl?.startsWith("postgresql://");

// Create a new connection pool to the PostgreSQL database
// A pool manages multiple connections, which is more efficient than opening a new connection for every query
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: shouldUseSSL
    ? {
      rejectUnauthorized: false, // Allow self-signed certificates (common in some cloud providers)
    }
    : undefined,
});

// Helper function to execute queries
// This abstracts the pool.query method for easier usage throughout the app
/**
 * Executes a SQL query against the database.
 * @template T - The type of the query result rows
 * @param {string} text - The SQL query string
 * @param {any[]} [params] - Optional parameters for the query
 * @returns {Promise<QueryResult<T>>} The result of the query
 */
export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
) => pool.query<T>(text, params);

/**
 * Initializes the database schema by creating necessary tables if they don't exist.
 * Creates 'users' and 'tasks' tables.
 * @returns {Promise<void>}
 */
export const initDb = async () => {
  // Create 'users' table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Create 'tasks' table with a foreign key reference to 'users'
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

