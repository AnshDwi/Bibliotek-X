import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, default: "" },
    hallTicketCode: { type: String, required: true }
  },
  { timestamps: true }
);

export const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);
