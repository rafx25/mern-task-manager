const required = ["NODE_ENV", "PORT", "CLIENT_URL", "MONGODB_URI", "JWT_SECRET", "ACCESS_TOKEN_EXPIRES_IN", "REFRESH_TOKEN_EXPIRES_DAYS"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Fail at boot instead of throwing a confusing runtime error later.
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error(`JWT_SECRET must be at least 32 characters`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  clientUrl: process.env.CLIENT_URL,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresDays: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS),
  isProduction: process.env.NODE_ENV === "production",
};
