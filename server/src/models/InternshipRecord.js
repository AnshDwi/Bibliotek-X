import mongoose from "mongoose";

const internshipRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    duration: { type: String, default: "" },
    status: { type: String, enum: ["applied", "active", "completed"], default: "applied" },
    mentorName: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

export const InternshipRecord = mongoose.model("InternshipRecord", internshipRecordSchema);
