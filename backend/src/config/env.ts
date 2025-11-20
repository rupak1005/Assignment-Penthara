import dotenv from "dotenv";

dotenv.config();


export const env = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

export default env;

