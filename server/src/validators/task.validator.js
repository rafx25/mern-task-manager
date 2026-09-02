import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../models/task.model.js";

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
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
});

export const updateTaskBody = z
  .strictObject({
    title: z.string().trim().min(3).max(120).optional(),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
  })
  // An empty PATCH is almost always a client bug worth surfacing.
  .refine((body) => Object.keys(body).length > 0, {
    error: "Provide at least one field to update",
  });

export const listTasksQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(TASK_STATUSES).optional(),

  // Allowlisted because this string goes straight into a MongoDB sort(), and a
  // sort on an unindexed field is a collection scan.
  sortBy: z.enum(["createdAt", "updatedAt", "priority"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
