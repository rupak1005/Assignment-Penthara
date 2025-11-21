import dotenv from "dotenv";

// Load environment variables from .env file into process.env
dotenv.config();


// Export a centralized configuration object
// This makes it easier to manage and access environment variables throughout the application
// It also allows providing default values for development
export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

export default env;

