import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    // Expired and tampered tokens are both 401; the client's move is the same
    // either way, and distinguishing them tells an attacker which one they hit.
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Session expired");
    }
    throw new ApiError(401, "Invalid authentication");
  }
};
