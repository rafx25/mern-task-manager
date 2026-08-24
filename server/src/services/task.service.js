import { Task } from "../models/task.model.js";
import { ApiError } from "../ulits/api-error.js";

export const createTask = async (input, currentUser) => {
  return Task.create({
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    createdBy: currentUser.id,
  });
};

export const listTasks = async (currentUser) => {
  // Admin see everything: everyone else is scoped to their own tasks.
  const filter = { deletedAt: null };
  if (currentUser.role !== "admin") {
    filter.createdBy = currentUser.id;
  }

  return Task.find(filter).select("-__v").sort({ createdAt: -1 }).lean();
};

export const getTaskById = async (taskId, currentUser) => {
  const task = await Task.findOne({ _id: taskId, deletedAt: null });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  assertCanAccess(task, currentUser);
  return task;
};

export const updateTask = async (taskId, input, currentUser) => {
  const task = await getTaskById(taskId, currentUser);

  // Assigned field by field. Spreading req.body here would let a caller
  // overwrite createdBy or deletedAt through the update endpoint.
  if (input.title !== undefined) task.title = input.title;
  if (input.description !== undefined) task.description = input.description;
  if (input.status !== undefined) task.status = input.status;
  if (input.priority !== undefined) task.priority = input.priority;

  return task.save();
};

const assertCanAccess = (task, currentUser) => {
  const isOwner = task.createdBy.equals(currentUser.id);

  if (!isOwner && currentUser.role !== "admin") {
    // 404 rather than 403: a 403 would confirm the task exists to someone
    // who has no business knowing that.
    throw new ApiError(404, "Task not found");
  }
};
