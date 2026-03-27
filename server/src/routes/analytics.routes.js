import { Router } from "express";

import {
  getAdminAnalytics,
  getLeaderboard,
  getStudentAnalytics
} from "../controllers/analytics.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/student",
  authenticate,
  authorize(ROLES.STUDENT),
  asyncHandler(getStudentAnalytics)
);
analyticsRouter.get(
  "/admin",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(getAdminAnalytics)
);
analyticsRouter.get("/leaderboard", authenticate, asyncHandler(getLeaderboard));
