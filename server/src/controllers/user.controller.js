import * as userService from "../services/user.service.js";

export const listUsers = async (req, res) => {
  const { users, pagination } = await userService.listUsers(req.validated.query);
  res.status(200).json({ success: true, data: users, pagination });
};

export const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.validated.params.id);
  res.status(200).json({ success: true, data: user });
};

export const updateUserRole = async (req, res) => {
  const user = await userService.updateUserRole(req.validated.params.id, req.validated.body.role, req.user);
  res.status(200).json({ success: true, data: user });
};

export const updateUserStatus = async (req, res) => {
  const user = await userService.updateUserStatus(req.validated.params.id, req.validated.body.isActive, req.user);
  res.status(200).json({ success: true, data: user });
};
