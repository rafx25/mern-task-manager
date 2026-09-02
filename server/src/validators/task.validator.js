import { z } from "zod";
import { TASK_STATUS, TASK_PRIORITY } from "../models/task.model.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  error: "Must be a valid id",
});

export const taskIdParams = z.object({
  id: objectId,
});

// strictObject() rejects unknown keys outright. A request carrying createdBy
// or deletedAt is either a bug or an attempt, and silently dropping it hides
// both.
export const createTaskBody = z.strictObject({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(TASK_STATUS).optional(),
  priority: z.enum(TASK_PRIORITY).optional(),
});

export const updateTaskBody = z
  .strictObject({
    title: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(TASK_STATUS).optional(),
    priority: z.enum(TASK_PRIORITY).optional(),
  })
  // An empty PATCH is almost always a client bug worth surfacing.
  .refine((body) => Object.keys(body).length > 0, {
    error: "Provide at least one field to update",
  });
