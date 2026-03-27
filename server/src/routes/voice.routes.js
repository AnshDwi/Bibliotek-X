import { Router } from "express";

import { postVoiceDoubt } from "../controllers/voice.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const voiceRouter = Router();

voiceRouter.post("/doubt", authenticate, asyncHandler(postVoiceDoubt));

