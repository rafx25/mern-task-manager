import mongoose from "mongoose";
import { ZodError } from "zod";
import { ApiError } from "../ulits/api-error.js";
import { env } from "../config/env.js";

// Only the first issue is surfaced. The frontend shows one message at a time,
// and returning the full list mostly invites clients to render a wall of text.
const fromZodError = (err) => {
  const [issue] = err.issues ?? [];

  if (!issue) {
    return new ApiError(400, "Invalid request data");
  }

  return new ApiError(400, issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message);
};

// Moongose throws CastError when a path cannot be coerced to its schema type.
const fromCastError = (err) => new ApiError(400, `Invalid value for ${err.path}`);

const fromValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new ApiError(400, messages.join(". "));
};

// 11000 is raised by the database, not by a schema validator, so it never
// arrives as a Mongoose ValidationError.
const fromDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
  return new ApiError(409, `That ${field} is already in use`);
};

const normalize = (err) => {
  if (err instanceof ApiError) return err;
  if (err instanceof ZodError) return fromZodError(err);
  if (err instanceof mongoose.Error.CastError) return fromCastError(err);
  if (err instanceof mongoose.Error.ValidationError) return fromValidationError(err);
  if (err.code === 11000) return fromDuplicateKeyError(err);

  // express.json() rejects malformed bodies before any route runs.
  if (err instanceof SyntaxError && "body" in err) {
    return new ApiError(400, "Request body is not valid JSON");
  }
};

export const errorHandler = (err, req, res, next) => {
  const apiError = normalize(err);

  if (apiError) {
    return res.status(apiError.statusCode).json({
      success: false,
      message: apiError.message,
    });
  }

  // Anything reaching here is a bug, not a handled condition. Log the whole
  // thing; send the client nothing that describes the internals.
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};
