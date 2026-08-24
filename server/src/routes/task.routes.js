import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";

const router = Router();

router.post("/", taskController.createTask);
router.get("/", taskController.listTasks);
router.get("/:id", taskController.getTaskById);
router.patch("/:id", taskController.updateTask);

export default router;
