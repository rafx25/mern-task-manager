import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { requireRole } from "../middleware/authorize.middleware.js";

const router = Router();

router.post("/", taskController.createTask);
router.get("/", taskController.listTasks);

// Must be declared before /:id, otherwise Express matches "deleted" as an id.
router.get("/deleted", requireRole("admin"), taskController.listDeletedTasks);

router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);

export default router;
