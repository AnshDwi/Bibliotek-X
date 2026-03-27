import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    durationMinutes: { type: Number, default: 25 },
    inactivityEvents: { type: Number, default: 0 },
    tabSwitches: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 },
    pomodoroCompleted: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const FocusSession = mongoose.model("FocusSession", focusSessionSchema);

