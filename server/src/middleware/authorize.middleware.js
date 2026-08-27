import { ApiError } from "../ulits/api-error.js";

// Role is already on req.user, so this rejects before any database work.
// Ownership checks are different and belong in the service, since the owner
// is not known until the document is loaded.
export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  };
