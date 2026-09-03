import crypto from "node:crypto";

// 256 bits of entropy. There is nothing to guess, so a fast hash is the right choice,
// unlike passwords, where slowness is the point.
export const generateRefreshToken = () => crypto.randomBytes(32).toString("base64url");

export const hashRefreshToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
