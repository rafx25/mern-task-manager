import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port} [${env.nodeEnv}]`);
});

// Let in-flight requests finish before the host kills the container on redeploy.
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
