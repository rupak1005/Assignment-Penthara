import express from "express";
import cors from "cors";
import env from "./config/env";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;

