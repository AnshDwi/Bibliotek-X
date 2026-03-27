import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "live", "completed"], default: "scheduled" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    recordingUrl: { type: String, default: "" },
    transcript: { type: String, default: "" },
    notes: { type: String, default: "" },
    attendees: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const LiveSession = mongoose.model("LiveSession", liveSessionSchema);
