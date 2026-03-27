import mongoose from "mongoose";

const parentMessageSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentEmail: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["attendance", "performance", "weekly-report", "risk-alert"], default: "weekly-report" },
    status: { type: String, enum: ["queued", "sent"], default: "sent" }
  },
  { timestamps: true }
);

export const ParentMessage = mongoose.model("ParentMessage", parentMessageSchema);

