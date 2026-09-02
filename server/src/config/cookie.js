import { env } from "./env.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const accessTokenCookie = {
  // Keeps the token out of reach of any script running on the page.
  httpOnly: true,

  // Localhost is served over plain http, so this has to be conditional.
  secure: env.isProduction,

  // Blocks the token from riding along on cross-site form posts and fetches
  sameSite: "lax",

  maxAge: SEVEN_DAYS_MS,
  path: "/",
};
