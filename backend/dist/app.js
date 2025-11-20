"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = __importDefault(require("./config/env"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const app = (0, express_1.default)();
const corsOrigin = env_1.default.corsOrigins.includes("*") || env_1.default.corsOrigins.length === 0
    ? true
    : env_1.default.corsOrigins;
app.use((0, cors_1.default)({
    origin: corsOrigin,
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/api/health", (_, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map