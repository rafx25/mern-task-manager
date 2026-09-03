import { env } from "./env.js";

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

const base = {
  // Keeps tokens out of reach of any script running on the page.
  httpOnly: true,

  // Localhost is served over plain http, so this has to be conditional.
  secure: env.isProduction,

  // Blocks tokens from riding along on cross-site form posts and fetches.
  sameSite: "lax",
};

export const accessTokenCookie = {
  ...base,
  maxAge: 15 * MINUTE_MS,
  path: "/",
};

// Scoped to the auth routes so it is not attached to every ordinary API call.
// Fewer requests carrying it means fewer places it can leak from.
export const refreshTokenCookie = {
  ...base,
  maxAge: env.refreshTokenExpiresDays * DAY_MS,
  path: "/api/auth",
};
