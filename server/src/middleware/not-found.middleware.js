import { ApiError } from "../utils/api-error.js";

// Reached only when no route matched, so it turns a miss into the same
// error shape as everything else instead of a bare response.
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};
