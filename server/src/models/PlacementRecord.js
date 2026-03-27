import mongoose from "mongoose";

const placementRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true, trim: true },
    roleTitle: { type: String, required: true, trim: true },
    packageLpa: { type: Number, default: 0 },
    status: { type: String, enum: ["applied", "shortlisted", "placed"], default: "applied" },
    driveDate: { type: Date, required: true }
  },
  { timestamps: true }
);

export const PlacementRecord = mongoose.model("PlacementRecord", placementRecordSchema);
