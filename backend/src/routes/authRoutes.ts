import { Router } from "express";
import { login, register, me } from "../controllers/authController";
import authenticate from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;

