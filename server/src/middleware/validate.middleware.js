import { ZodError } from "zod";

// Express 5 makes req.query a getter, so parsed values go on req.validated
// rather than overwriting the originals in place.
export const validate = (schemas) => (req, res, next) => {
  req.validated = {};

  for (const [source, schema] of Object.entries(schemas)) {
    // Throws ZodError, which the central error handler turns into a 400.
    req.validated[source] = schema.parse(req[source]);
  }

  next();
};
