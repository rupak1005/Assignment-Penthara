import app from "./app";
import { initDb } from "./config/database";
import env from "./config/env";

/**
 * Starts the Express server and initializes the database connection.
 * It listens on the port defined in the environment variables.
 */
const startServer = async () => {
  try {
    // Initialize the database connection
    await initDb();

    // Start listening on the configured port
    app.listen(env.port, () => {
      console.log(`API server running on port ${env.port}`);
    });
  } catch (error) {
    // Log error and exit if server fails to start
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

// Execute the start server function
startServer();

