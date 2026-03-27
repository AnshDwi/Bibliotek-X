import { Router } from "express";

import {
  getCourseContent,
  postContent,
  postExplain
} from "../controllers/content.controller.js";
import { ROLES } from "../constants/roles.js";
import { audit } from "../middleware/audit.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const contentRouter = Router();

contentRouter.get("/:courseId", authenticate, asyncHandler(getCourseContent));
contentRouter.post(
  "/:courseId",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.TEACHER),
  upload.single("file"),
  audit("content.create", "content"),
  asyncHandler(postContent)
);
contentRouter.post("/explain", authenticate, asyncHandler(postExplain));

