"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.use(authMiddleware_1.default);
router.get("/", taskController_1.getTasks);
router.post("/", taskController_1.createTask);
router.put("/:id", taskController_1.updateTask);
router.patch("/:id/toggle", taskController_1.toggleTaskCompletion);
router.delete("/:id", taskController_1.deleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map