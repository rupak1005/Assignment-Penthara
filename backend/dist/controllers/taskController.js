"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTaskCompletion = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../config/database");
/**
 * Returns every task belonging to the authenticated user.
 *
 * We normalize `due_date` to an ISO `YYYY-MM-DD` string using `TO_CHAR`
 * because the frontend only cares about the date portion and relies on
 * string equality for calendar lookups. Doing the conversion here keeps
 * all clients consistent and avoids timezone drift bugs.
 */
const getTasks = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await (0, database_1.query)(`SELECT id,
              title,
              description,
              TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
              priority,
              completed,
              created_at as "createdAt"
       FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
        return res.json(result.rows);
    }
    catch (error) {
        console.error("Get tasks error", error);
        return res.status(500).json({ message: "Failed to load tasks" });
    }
};
exports.getTasks = getTasks;
/**
 * Persists a new task for the authenticated user.
 *
 * The controller is deliberately thin—validation and normalization happen
 * before passing values to SQL so Postgres can enforce constraints. We store
 * `due_date` as a native DATE but serialize it back as a string (same as getTasks).
 */
const createTask = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { title, description, dueDate, priority } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const taskId = (0, uuid_1.v4)();
        const result = await (0, database_1.query)(`INSERT INTO tasks (id, user_id, title, description, due_date, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id,
                 title,
                 description,
                 TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
                 priority,
                 completed,
                 created_at as "createdAt"`, [taskId, userId, title, description || null, dueDate || null, priority || "medium"]);
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Create task error", error);
        return res.status(500).json({ message: "Failed to create task" });
    }
};
exports.createTask = createTask;
/**
 * Applies partial updates to a task as long as it belongs to the current user.
 *
 * NOTE: We pass `dueDate || null` directly to Postgres. When the UI wants to
 * clear a date it sends an empty string, so this coerces to `null` and the DB
 * clears the column. Leaving it `undefined` keeps the previous value.
 */
const updateTask = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { title, description, dueDate, priority, completed } = req.body;
        const result = await (0, database_1.query)(`UPDATE tasks
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
                 created_at as "createdAt"`, [title, description, dueDate || null, priority, completed, id, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Update task error", error);
        return res.status(500).json({ message: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
/**
 * Removes a task permanently. Ownership check happens in the WHERE clause.
 */
const deleteTask = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const result = await (0, database_1.query)("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
            id,
            userId,
        ]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(204).send();
    }
    catch (error) {
        console.error("Delete task error", error);
        return res.status(500).json({ message: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
/**
 * Convenience endpoint that flips the completion state server-side so the
 * client doesn't need to pull the latest value first.
 */
const toggleTaskCompletion = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const result = await (0, database_1.query)(`UPDATE tasks
       SET completed = NOT completed
       WHERE id = $1 AND user_id = $2
       RETURNING id,
                 title,
                 description,
                 TO_CHAR(due_date, 'YYYY-MM-DD') as "dueDate",
                 priority,
                 completed,
                 created_at as "createdAt"`, [id, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Toggle task error", error);
        return res.status(500).json({ message: "Failed to toggle task" });
    }
};
exports.toggleTaskCompletion = toggleTaskCompletion;
//# sourceMappingURL=taskController.js.map