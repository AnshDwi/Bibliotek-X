import { Router } from "express";

import {
  getCourse,
  getCoursePortal,
  getCourses,
  getMyEnrollments,
  patchCourse,
  postCourse,
  postEnrollment
} from "../controllers/course.controller.js";
import { ROLES } from "../constants/roles.js";
import { audit } from "../middleware/audit.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const courseRouter = Router();

courseRouter.get("/", asyncHandler(getCourses));
courseRouter.get("/me/enrollments", authenticate, asyncHandler(getMyEnrollments));
courseRouter.get("/:id/portal", authenticate, asyncHandler(getCoursePortal));
courseRouter.get("/:id", asyncHandler(getCourse));
courseRouter.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.TEACHER),
  audit("course.create", "course"),
  asyncHandler(postCourse)
);
courseRouter.patch(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.TEACHER),
  audit("course.update", "course"),
  asyncHandler(patchCourse)
);
courseRouter.post(
  "/:id/enroll",
  authenticate,
  authorize(ROLES.STUDENT),
  audit("course.enroll", "course"),
  asyncHandler(postEnrollment)
);
