import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { taskIdParams, createTaskBody, updateTaskBody } from "../validators/task.validator.js";

const router = Router();

// Every task route needs a signed-in user, so this guards the whole group
// instead of being repeated on each line
router.use(requireAuth);

router.post("/", validate({ body: createTaskBody }), taskController.createTask);

router.get("/", taskController.listTasks);

// Must be declared before /:id, otherwise Express matches "deleted" as an id.
router.get("/deleted", requireRole("admin"), taskController.listDeletedTasks);

router.get("/:id", validate({ params: taskIdParams }), taskController.getTaskById);

router.patch("/:id", validate({ params: taskIdParams, body: updateTaskBody }), taskController.updateTask);

export default router;
