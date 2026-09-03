import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound } from "./middleware/not-found.middleware.js";
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
app.use(cookieParser());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
