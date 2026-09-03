import * as authService from "../services/auth.service.js";
import { accessTokenCookie, refreshTokenCookie } from "../config/cookie.js";

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("accessToken", accessToken, accessTokenCookie);
  res.cookie("refreshToken", refreshToken, refreshTokenCookie);
};

const clearAuthCookies = (res) => {
  // maxAge is dropped so the browser removes the cookies instead of resetting
  // their lifetime. Every other option has to match the original exactly.
  const { maxAge: _a, ...accessOptions } = accessTokenCookie;
  const { maxAge: _r, ...refreshOptions } = refreshTokenCookie;

  res.clearCookie("accessToken", accessOptions);
  res.clearCookie("refreshToken", refreshOptions);
};

export const register = async (req, res) => {
  const { user, ...tokens } = await authService.register(req.validated.body);

  setAuthCookies(res, tokens);
  res.status(201).json({ success: true, data: user });
};

export const login = async (req, res) => {
  const { user, ...tokens } = await authService.login(req.validated.body);

  setAuthCookies(res, tokens);
  res.status(200).json({ success: true, data: user });
};

export const refresh = async (req, res) => {
  const { user, ...tokens } = await authService.refresh(req.cookies?.refreshToken);

  setAuthCookies(res, tokens);
  res.status(200).json({ success: true, data: user });
};

export const logout = async (req, res) => {
  await authService.revokeSession(req.cookies?.refreshToken);

  clearAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out" });
};

export const me = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ success: true, data: user });
};
