import { Router } from "express";

import { postAssignmentSubmission } from "../controllers/assignment.controller.js";
import { ROLES } from "../constants/roles.js";
import { audit } from "../middleware/audit.middleware.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const assignmentRouter = Router();

assignmentRouter.post(
  "/:id/submissions",
  authenticate,
  authorize(ROLES.STUDENT),
  audit("assignment.submit", "assignment"),
  asyncHandler(postAssignmentSubmission)
);
