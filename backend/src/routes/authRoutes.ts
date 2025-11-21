import { Router } from "express";
import { login, register, me } from "../controllers/authController";
import authenticate from "../middleware/authMiddleware";

// Create a new Router instance for authentication routes
const router = Router();

// Route for user registration
// POST /api/auth/register
router.post("/register", register);

// Route for user login
// POST /api/auth/login
router.post("/login", login);

// Route to get the current authenticated user's information
// GET /api/auth/me
// Protected by the 'authenticate' middleware
router.get("/me", authenticate, me);

export default router;

