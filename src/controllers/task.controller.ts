import { Request, Response } from "express";
import prisma from "../prisma";

/* ================= CREATE TASK ================= */
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const userId = (req as any).user.userId;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task" });
  }
};

/* ================= GET ALL TASKS ================= */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        title: search ? { contains: search } : undefined,
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
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* ================= GET SINGLE TASK ================= */
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.userId;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

/* ================= UPDATE TASK ================= */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.userId;
    const { title, status } = req.body;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title ?? task.title,
        status: status ?? task.status,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

/* ================= DELETE TASK ================= */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.userId;

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
    return res.status(500).json({ message: "Failed to delete task" });
  }
};

/* ================= TOGGLE TASK STATUS ================= */
export const toggleTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user.userId;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: !task.status,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Failed to toggle task status" });
  }
};
