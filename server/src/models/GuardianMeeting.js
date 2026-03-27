import mongoose from "mongoose";

const guardianMeetingSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guardianName: { type: String, required: true, trim: true },
    guardianEmail: { type: String, default: "", trim: true },
    meetingDate: { type: Date, required: true },
    mode: { type: String, enum: ["call", "video", "in-person"], default: "call" },
    status: { type: String, enum: ["scheduled", "completed"], default: "scheduled" },
    summary: { type: String, default: "" },
    actionItems: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const GuardianMeeting = mongoose.model("GuardianMeeting", guardianMeetingSchema);
