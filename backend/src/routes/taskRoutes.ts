import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskCompletion,
  updateTask,
} from "../controllers/taskController";
import authenticate from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/toggle", toggleTaskCompletion);
router.delete("/:id", deleteTask);

export default router;

