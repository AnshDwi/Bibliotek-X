import { Router } from "express";

import { getMessages, postMessage } from "../controllers/collaboration.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const collaborationRouter = Router();

collaborationRouter.get("/rooms/:roomId/messages", authenticate, asyncHandler(getMessages));
collaborationRouter.post("/rooms/:roomId/messages", authenticate, asyncHandler(postMessage));
