import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken } from "../utils/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refresh-token.js";
import { env } from "../config/env.js";

const issueSession = async (user) => {
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + env.refreshTokenExpiresDays * 24 * 60 * 60 * 1000);

  await Session.create({
    user: user._id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
  });

  return { accessToken: signAccessToken(user), refreshToken };
};

export const register = async (input) => {
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  return { user, ...(await issueSession(user)) };
};

export const login = async (input) => {
  const user = await User.findOne({ email: input.email }).select("+password");

  // Same message and same shape whether the email is unknown or the password
  // is wrong. Splitting them turns login into an account enumeration oracle.
  if (!user || !(await user.verifyPassword(input.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated");
  }

  return { user, ...(await issueSession(user)) };
};

export const refresh = async (presentedToken) => {
  if (!presentedToken) {
    throw new ApiError(401, "Authentication required");
  }

  const session = await Session.findOne({
    tokenHash: hashRefreshToken(presentedToken),
  });

  if (!session) {
    throw new ApiError(401, "Invalid session");
  }

  // A spent token in the wild means the value was captured somewhere. We
  // cannot tell the thief from the victim, so every session for this user is
  // dropped and both are forced to sign in again.
  if (session.revokedAt) {
    await Session.updateMany({ user: session.user, revokedAt: null }, { revokedAt: new Date() });
    throw new ApiError(401, "Session reuse detected. Please sign in again.");
  }

  // The TTL index sweeps roughly once a minute, so expiry is checked here
  // rather than trusted to the index.
  if (session.expiresAt < new Date()) {
    throw new ApiError(401, "Session expired");
  }

  const user = await User.findById(session.user);

  if (!user || !user.isActive) {
    await Session.updateMany({ user: session.user }, { revokedAt: new Date() });
    throw new ApiError(401, "Session is no longer valid");
  }

  session.revokedAt = new Date();
  await session.save();

  return { user, ...(await issueSession(user)) };
};

export const revokeSession = async (presentedToken) => {
  if (!presentedToken) return;

  await Session.updateOne({ tokenHash: hashRefreshToken(presentedToken), revokedAt: null }, { revokedAt: new Date() });
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  return user;
};
