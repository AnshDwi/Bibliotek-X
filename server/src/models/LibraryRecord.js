import mongoose from "mongoose";

const libraryRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookTitle: { type: String, required: true, trim: true },
    accessionCode: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ["issued", "overdue", "returned"], default: "issued" },
    fineAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const LibraryRecord = mongoose.model("LibraryRecord", libraryRecordSchema);
