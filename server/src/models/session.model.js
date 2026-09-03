import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // The raw token is never stored. If this collection leaks, the hashes
    // are not usable as credentials.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    // Set when the session is rotated or logged out. Kept rather than deleted
    // so that presenting a spent token can be recognised as reuse.
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Mongo drops the document once expiresAt passes, so dead sessions do not
// accumulate. Cleanup runs roughly every 60 seconds.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model("Session", sessionSchema);
