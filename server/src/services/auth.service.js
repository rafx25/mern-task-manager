import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken } from "../utils/jwt.js";

export const register = async (input) => {
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  return { user, accessToken: signAccessToken(user) };
};

export const login = async (input) => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user || !(await user.verifyPassword(input.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated");
  }

  return { user, accessToken: signAccessToken(user) };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  return user;
};
