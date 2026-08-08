import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim().default(""),

  completed: z.boolean().default(false),
});

export const todoSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim(),

  completed: z.boolean(),
});

export const updateTodoSchema = todoSchema.partial();
