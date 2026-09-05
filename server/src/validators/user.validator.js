import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  error: "Must be a valid id",
});

export const userIdParams = z.object({
  id: objectId,
});

export const listUsersQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.stringbool().optional(),
});

export const updateUserRoleBody = z.strictObject({
  role: z.enum(["user", "admin"]),
});

export const updateUserStatusBody = z.strictObject({
  isActive: z.boolean(),
});
