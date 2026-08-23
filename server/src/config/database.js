import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  // Reject writes for fields not declared in a schema.
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    // Fail fast if the database is unreachable.
    serverSelectionTimeoutMS: 5000,
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected. Driver will retry automatically.");
  });

  return mongoose.connection;
};

export const disconnectDB = () => mongoose.connection.close();
