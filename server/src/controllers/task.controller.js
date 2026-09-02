import * as taskService from "../services/task.service.js";

export const createTask = async (req, res) => {
  const task = await taskService.createTask(req.validated.body, req.user);
  res.status(201).json({ success: true, data: task });
};

export const listTasks = async (req, res) => {
  const task = await taskService.listTasks(req.user);
  res.status(200).json({ success: true, data: task });
};

export const listDeletedTasks = async (req, res) => {
  const tasks = await taskService.listDeletedTasks();
  res.status(200).json({ success: true, data: tasks });
};

export const getTaskById = async (req, res) => {
  const task = await taskService.getTaskById(req.validated.params.id, req.user);
  res.status(200).json({ success: true, data: task });
};

export const updateTask = async (req, res) => {
  const task = await taskService.updateTask(req.validated.params.id, req.validated.body, req.user);
  res.status(200).json({ success: true, data: task });
};
