import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { attachDevUser } from "./middleware/dev-user.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    // Required for the browser to send auth cookie on cross-origin requests
    credentials: true,
  }),
);

// 10kb is plenty for JSON payloads. Anything larger is either a bug
// or someone trying to exhaust memory.
app.use(express.json({ limit: "10kb" }));

// ^TEMPORARY: replaced by real auth middleware
app.use(attachDevUser);

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `"Route not found: ${req.originalUrl}`,
  });
});

app.use(errorHandler);

export default app;
