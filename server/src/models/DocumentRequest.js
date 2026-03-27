import mongoose from "mongoose";

const documentRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["bonafide", "transcript", "id-reissue", "fee-receipt"], required: true },
    purpose: { type: String, required: true, trim: true },
    status: { type: String, enum: ["submitted", "under-review", "approved", "rejected"], default: "submitted" },
    remarks: { type: String, default: "" },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const DocumentRequest = mongoose.model("DocumentRequest", documentRequestSchema);
