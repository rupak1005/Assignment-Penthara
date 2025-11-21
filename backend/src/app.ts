// Import necessary modules
import express from "express";
import cors from "cors";
import env from "./config/env";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

// Initialize the Express application
const app = express();

// Define allowed origins for CORS (Cross-Origin Resource Sharing)
// This ensures that only requests from these specific domains are allowed to access the API
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://assignment-penthara.vercel.app",
  "https://assignment-penthara.onrender.com",
  env.corsOrigin,
];

// Configure CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Health check endpoint to verify if the server is running
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// Mount authentication routes at /api/auth
app.use("/api/auth", authRoutes);
// Mount task routes at /api/tasks
app.use("/api/tasks", taskRoutes);

export default app;

