import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskCompletion,
  updateTask,
} from "../controllers/taskController";
import authenticate from "../middleware/authMiddleware";

// Create a new Router instance for task-related routes
const router = Router();

// Apply authentication middleware to all routes in this router
// This ensures that all task operations require a logged-in user
router.use(authenticate);

// Route to get all tasks for the authenticated user
// GET /api/tasks
router.get("/", getTasks);

// Route to create a new task
// POST /api/tasks
router.post("/", createTask);

// Route to update an existing task by ID
// PUT /api/tasks/:id
router.put("/:id", updateTask);

// Route to toggle the completion status of a task
// PATCH /api/tasks/:id/toggle
router.patch("/:id/toggle", toggleTaskCompletion);

// Route to delete a task by ID
// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

export default router;

