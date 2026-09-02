import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { registerBody, loginBody } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate({ body: registerBody }), authController.register);
router.post("/login", validate({ body: loginBody }), authController.login);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;
