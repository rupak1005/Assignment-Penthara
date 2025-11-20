import app from "./app";
import { initDb } from "./config/database";
import env from "./config/env";

const startServer = async () => {
  try {
    await initDb();
    app.listen(env.port, () => {
      console.log(`API server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

