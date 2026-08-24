import * as taskService from "../services/task.service.js";

export const createTask = async (req, res) => {
  const task = await taskService.createTask(req.body, req.user);
  res.status(201).json({ success: true, data: task });
};

export const listTasks = async (req, res) => {
  const task = await taskService.listTasks(req.user);
  res.status(200).json({ success: true, data: task });
};

export const getTaskById = async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  res.status(200).json({ success: true, data: task });
};

export const updateTask = async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: task });
};
