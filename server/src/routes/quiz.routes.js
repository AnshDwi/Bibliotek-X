import { Router } from "express";

import { getAdaptiveQuiz, submitAdaptiveQuiz } from "../controllers/quiz.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const quizRouter = Router();

quizRouter.get("/adaptive", authenticate, asyncHandler(getAdaptiveQuiz));
quizRouter.post("/adaptive/submit", authenticate, asyncHandler(submitAdaptiveQuiz));

