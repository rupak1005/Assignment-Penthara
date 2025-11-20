import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
/**
 * Returns every task belonging to the authenticated user.
 *
 * We normalize `due_date` to an ISO `YYYY-MM-DD` string using `TO_CHAR`
 * because the frontend only cares about the date portion and relies on
 * string equality for calendar lookups. Doing the conversion here keeps
 * all clients consistent and avoids timezone drift bugs.
 */
export declare const getTasks: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Persists a new task for the authenticated user.
 *
 * The controller is deliberately thin—validation and normalization happen
 * before passing values to SQL so Postgres can enforce constraints. We store
 * `due_date` as a native DATE but serialize it back as a string (same as getTasks).
 */
export declare const createTask: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Applies partial updates to a task as long as it belongs to the current user.
 *
 * NOTE: We pass `dueDate || null` directly to Postgres. When the UI wants to
 * clear a date it sends an empty string, so this coerces to `null` and the DB
 * clears the column. Leaving it `undefined` keeps the previous value.
 */
export declare const updateTask: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Removes a task permanently. Ownership check happens in the WHERE clause.
 */
export declare const deleteTask: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Convenience endpoint that flips the completion state server-side so the
 * client doesn't need to pull the latest value first.
 */
export declare const toggleTaskCompletion: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=taskController.d.ts.map