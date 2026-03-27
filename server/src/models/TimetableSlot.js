import mongoose from "mongoose";

const timetableSlotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    dayOfWeek: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, default: "" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    audience: { type: String, enum: ["all", "students", "teachers"], default: "all" }
  },
  { timestamps: true }
);

export const TimetableSlot = mongoose.model("TimetableSlot", timetableSlotSchema);
