import mongoose from "mongoose";

const feeItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true }
  },
  { _id: false }
);

const feeRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    term: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["paid", "partial", "pending"], default: "pending" },
    items: { type: [feeItemSchema], default: [] }
  },
  { timestamps: true }
);

export const FeeRecord = mongoose.model("FeeRecord", feeRecordSchema);
