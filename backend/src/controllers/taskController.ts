import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { query } from "../config/database";
import { AuthenticatedRequest } from "../types/auth";

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await query(
      `SELECT id,
              title,
              description,
              TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
              priority,
              completed,
              created_at as "createdAt"
       FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get tasks error", error);
    return res.status(500).json({ message: "Failed to load tasks" });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const taskId = uuidv4();
    const result = await query(
      `INSERT INTO tasks (id, user_id, title, description, due_date, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id,
                 title,
                 description,
                 TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
                 priority,
                 completed,
                 created_at as "createdAt"`,
      [taskId, userId, title, description || null, dueDate || null, priority || "medium"]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create task error", error);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, dueDate, priority, completed } = req.body;

    const result = await query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date = $3::date,
           priority = COALESCE($4, priority),
           completed = COALESCE($5, completed)
       WHERE id = $6 AND user_id = $7
       RETURNING id,
                 title,
                 description,
                 TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
                 priority,
                 completed,
                 created_at as "createdAt"`,
      [title, description, dueDate || null, priority, completed, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Update task error", error);
    return res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete task error", error);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

export const toggleTaskCompletion = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query(
      `UPDATE tasks
       SET completed = NOT completed
       WHERE id = $1 AND user_id = $2
       RETURNING id,
                 title,
                 description,
                 TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
                 priority,
                 completed,
                 created_at as "createdAt"`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Toggle task error", error);
    return res.status(500).json({ message: "Failed to toggle task" });
  }
};

