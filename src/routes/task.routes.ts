import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/* ================= PROTECTED TASK ROUTES ================= */

/**
 * All task routes require authentication
 */
router.use(authenticate);

/**
 * @route   POST /tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post("/", createTask);

/**
 * @route   GET /tasks
 * @desc    Get all tasks for logged-in user
 * @access  Private
 */
router.get("/", getTasks);

/**
 * @route   GET /tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get("/:id", getTaskById);

/**
 * @route   PUT /tasks/:id
 * @desc    Update task (title / status)
 * @access  Private
 */
router.put("/:id", updateTask);

/**
 * @route   PATCH /tasks/:id/toggle
 * @desc    Toggle task completion status
 * @access  Private
 */
router.patch("/:id/toggle", toggleTaskStatus);

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router.delete("/:id", deleteTask);

/* ================= ROUTER EXPORT ================= */
export default router;