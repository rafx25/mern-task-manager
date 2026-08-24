import mongoose from "mongoose";

export const TASK_STATUS = ["todo", "in_progress", "done"];
export const TASK_PRIORITY = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title must be at most 120 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be at most 2000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: { values: TASK_STATUS, message: "{VALUE} is not a valid status" },
      default: "todo",
    },

    priority: {
      type: String,
      enum: { values: TASK_PRIORITY, message: "{VALUE} is not a valid priority" },
      default: "medium",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Covers the main list query: a user's active tasks, newest first.
taskSchema.index({ createBy: 1, deletedAt: 1, createdAt: -1 });

taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Task = mongoose.model("Task", taskSchema);
