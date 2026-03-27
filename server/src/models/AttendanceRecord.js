import mongoose from "mongoose";

const attendanceEntrySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["present", "absent", "late"], required: true },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const attendanceRecordSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    entries: { type: [attendanceEntrySchema], default: [] }
  },
  { timestamps: true }
);

attendanceRecordSchema.index({ course: 1, date: 1 }, { unique: true });

export const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);

