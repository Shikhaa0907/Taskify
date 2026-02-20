import { Request, Response } from "express";
import prisma from "../prisma";

/* ---------- helper: safely get userId ---------- */
const getUserId = (req: Request): number => {
  return (req as any).user?.userId;
};

/* ================= CREATE TASK ================= */
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title } = req.body as { title?: string };
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR ❌", error);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

/* ================= GET ALL TASKS ================= */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as "completed" | "pending" | undefined;

    const skip = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        title: search
          ? { contains: search, }
          : undefined,
        status:
          status === "completed"
            ? true
            : status === "pending"
            ? false
            : undefined,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR ❌", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ================= GET SINGLE TASK ================= */
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("GET TASK ERROR ❌", error);
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

/* ================= UPDATE TASK ================= */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = getUserId(req);
    const { title, status } = req.body as {
      title?: string;
      status?: boolean;
    };

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title?.trim() ?? task.title,
        status: status ?? task.status,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR ❌", error);
    return res.status(500).json({ message: "Failed to update task" });
  }
};

/* ================= DELETE TASK ================= */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR ❌", error);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

/* ================= TOGGLE TASK STATUS ================= */
export const toggleTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: !task.status },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("TOGGLE TASK ERROR ❌", error);
    return res.status(500).json({ message: "Failed to toggle task status" });
  }
};