import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: { type: String, enum: ["all", "students", "teachers"], default: "all" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
