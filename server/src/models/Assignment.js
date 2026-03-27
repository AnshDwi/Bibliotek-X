import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submittedAt: { type: Date, default: Date.now },
    submissionUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    plagiarismScore: { type: Number, default: 0 },
    autoGraded: { type: Boolean, default: false }
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["assignment", "quiz"], default: "assignment" },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    maxScore: { type: Number, default: 100 },
    questionsCount: { type: Number, default: 0 },
    mcqAutoGradeEnabled: { type: Boolean, default: true },
    submissions: { type: [submissionSchema], default: [] }
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
