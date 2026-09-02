import * as authService from "../services/auth.service.js";
import { accessTokenCookie } from "../config/cookie.js";

export const register = async (req, res) => {
  const { user, accessToken } = await authService.register(req.validated.body);

  res.cookie("accessToken", accessToken, accessTokenCookie);
  res.status(201).json({ success: true, data: user });
};

export const login = async (req, res) => {
  const { user, accessToken } = await authService.login(req.validated.body);

  res.cookie("accessToken", accessToken, accessTokenCookie);
  res.status(200).json({ success: true, data: user });
};

export const logout = async (req, res) => {
  // maxAge is dropped so the browser removes the cookie instead of resetting
  // its lifetime. Every other option has to match the original exactly.
  const { maxAge, ...clearOptions } = accessTokenCookie;

  res.clearCookie("accessToken", clearOptions);
  res.status(200).json({ success: true, message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ success: true, data: user });
};
