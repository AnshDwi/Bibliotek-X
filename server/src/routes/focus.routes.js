import { Router } from "express";

import { postFocusSession } from "../controllers/focus.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const focusRouter = Router();

focusRouter.post("/sessions", authenticate, asyncHandler(postFocusSession));

