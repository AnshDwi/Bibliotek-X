import { QuizAttempt } from "../models/QuizAttempt.js";
import {
  generateAdaptiveQuiz,
  scoreAdaptiveQuiz
} from "../services/quiz/adaptive-quiz.service.js";

export const getAdaptiveQuiz = async (req, res) => {
  const difficulty = Number(req.query.difficulty || 1);
  const questions = generateAdaptiveQuiz(difficulty);
  res.json({
    difficulty,
    timerSeconds: 180,
    questions
  });
};

export const submitAdaptiveQuiz = async (req, res) => {
  const result = scoreAdaptiveQuiz(req.body.answers);
  const attempt = await QuizAttempt.create({
    user: req.user._id,
    course: req.body.courseId,
    score: result.score,
    difficulty: result.nextDifficulty,
    durationSeconds: req.body.durationSeconds || 0,
    answers: result.answers
  });

  res.status(201).json({
    attempt,
    nextDifficulty: result.nextDifficulty
  });
};

