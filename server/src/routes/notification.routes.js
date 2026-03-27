import { Router } from "express";

import {
  getNotifications,
  patchNotificationRead,
  postNotification
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const notificationRouter = Router();

notificationRouter.get("/", authenticate, asyncHandler(getNotifications));
notificationRouter.post("/", authenticate, asyncHandler(postNotification));
notificationRouter.patch("/:id/read", authenticate, asyncHandler(patchNotificationRead));
