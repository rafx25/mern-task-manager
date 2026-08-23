import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

const CONNECTION_STATE = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

// Used by uptime monitors and by the host's health check during deploys.
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running.",
    timestamp: new Date().toISOString(),
  });
});

// Report 503 when database is unreachable.
router.get("/db", (req, res) => {
  const state = mongoose.connection.readyState;
  const isConnected = state === 1;

  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    database: CONNECTION_STATE[state] ?? "unknown",
  });
});

export default router;
