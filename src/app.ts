import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running 🚀" });
});

export default app;