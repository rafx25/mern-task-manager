import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { userIdParams, listUsersQuery, updateUserRoleBody, updateUserStatusBody } from "../validators/user.validator.js";

const router = Router();

// Every route here is admin-only, so both guards are mounted on the router.
router.use(requireAuth, requireRole("admin"));

router.get("/", validate({ query: listUsersQuery }), userController.listUsers);

router.get("/:id", validate({ params: userIdParams }), userController.getUserById);

router.patch("/:id/role", validate({ params: userIdParams, body: updateUserRoleBody }), userController.updateUserRole);

router.patch("/:id/status", validate({ params: userIdParams, body: updateUserStatusBody }), userController.updateUserStatus);

export default router;
