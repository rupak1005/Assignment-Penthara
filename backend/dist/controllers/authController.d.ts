import type { Request, Response } from "express";
/**
 * Creates a brand-new account.
 *
 * 1. Normalizes the email so uniqueness checks are case-insensitive.
 * 2. Hashes the password with bcrypt (cost 10 keeps things snappy for demos).
 * 3. Inserts the user and returns a signed JWT so the frontend can persist a session.
 */
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Authenticates an existing user via email + password.
 *
 * We purposefully return the same error for "email not found" and "wrong password"
 * to avoid leaking which accounts exist. The JWT stores just enough fields for the UI.
 */
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Lightweight profile endpoint used by the frontend to hydrate the current session.
 * Reads the bearer token, verifies it, and echoes the payload back.
 */
export declare const me: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map