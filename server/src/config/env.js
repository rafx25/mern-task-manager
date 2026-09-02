const required = ["NODE_ENV", "PORT", "CLIENT_URL", "MONGODB_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];

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
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  isProduction: process.env.NODE_ENV === "production",
};
