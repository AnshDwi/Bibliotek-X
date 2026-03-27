import mongoose from "mongoose";

const hostelPassSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hostelName: { type: String, required: true, trim: true },
    roomNumber: { type: String, required: true, trim: true },
    wardenName: { type: String, default: "", trim: true },
    status: { type: String, enum: ["active", "pending", "expired"], default: "active" },
    validUntil: { type: Date, required: true }
  },
  { timestamps: true }
);

export const HostelPass = mongoose.model("HostelPass", hostelPassSchema);
