import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    prompt: String,
    selectedOption: String,
    correctOption: String,
    isCorrect: Boolean,
    difficulty: Number
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    score: { type: Number, default: 0 },
    difficulty: { type: Number, default: 1 },
    durationSeconds: { type: Number, default: 0 },
    answers: { type: [answerSchema], default: [] }
  },
  { timestamps: true }
);

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

