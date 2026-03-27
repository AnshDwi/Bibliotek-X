import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["pdf", "video", "note"], required: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    textContent: { type: String, default: "" },
    extractedTopics: { type: [String], default: [] },
    flashcards: {
      type: [
        {
          question: String,
          answer: String
        }
      ],
      default: []
    },
    summary: { type: String, default: "" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Content = mongoose.model("Content", contentSchema);

