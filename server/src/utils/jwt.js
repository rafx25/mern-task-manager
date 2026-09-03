import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Payload is readable by anyone holding the token, so it carries only the
// identifiers we would expose in an API responce.
export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.accessTokenExpiresIn },
  );

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);
