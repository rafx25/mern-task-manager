import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/database.js";

// Connect before listening.
await connectDB();
console.log("MongoDB connected");

const server = app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port} [${env.nodeEnv}]`);
});

// Let in-flight requests finish before the host kills the container on redeploy.
const shutdown = async () => {
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
