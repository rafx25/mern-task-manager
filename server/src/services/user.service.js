import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/api-error.js";

export const listUsers = async (query) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined) filter.isActive = query.isActive;

  const skip = (query.page - 1) * query.limit;

  // Both halves of the response come from the same filter, so they are issued
  // together rather than one after the other.
  const [users, total] = await Promise.all([User.find(filter).select("-__v").sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean(), User.countDocuments(filter)]);

  return {
    users,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateUserRole = async (userId, role, currentUser) => {
  // An admin demoting themselves can lock the last admin out of the system.
  if (userId === currentUser.id) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await getUserById(userId);
  user.role = role;
  await user.save();

  // The role is baked into the access token, so existing sessions would keep
  // the old one until they expire. Dropping them forces a fresh sign-in.
  await Session.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });

  return user;
};

export const updateUserStatus = async (userId, isActive, currentUser) => {
  if (userId === currentUser.id) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  const user = await getUserById(userId);
  user.isActive = isActive;
  await user.save();

  if (!isActive) {
    await Session.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
  }

  return user;
};
