const required = ["NODE_ENV", "PORT", "CLIENT_URL", "MONGODB_URI"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Fail at boot instead of throwing a confusing runtime error later.
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  clientUrl: process.env.CLIENT_URL,
  mongoUri: process.env.MONGODB_URI,
  isProduction: process.env.NODE_ENV === "production",
};
