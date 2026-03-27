import { Router } from "express";

import {
  getTeacherDashboard,
  getWeeklyReport,
  postAssignment,
  postAttendance,
  postContentSummary,
  postLiveSession,
  postParentMessage
} from "../controllers/teacher.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const teacherRouter = Router();

teacherRouter.use(authenticate, authorize(ROLES.TEACHER, ROLES.ADMIN));
teacherRouter.get("/dashboard", asyncHandler(getTeacherDashboard));
teacherRouter.post("/attendance", asyncHandler(postAttendance));
teacherRouter.post("/assignments", asyncHandler(postAssignment));
teacherRouter.post("/parent-messages", asyncHandler(postParentMessage));
teacherRouter.post("/live-sessions", asyncHandler(postLiveSession));
teacherRouter.get("/reports/:studentId", asyncHandler(getWeeklyReport));
teacherRouter.post("/content-summary", asyncHandler(postContentSummary));

