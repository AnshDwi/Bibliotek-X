import mongoose from "mongoose";

const transportPassSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    routeName: { type: String, required: true, trim: true },
    stopName: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "pending", "expired"], default: "active" },
    validUntil: { type: Date, required: true }
  },
  { timestamps: true }
);

export const TransportPass = mongoose.model("TransportPass", transportPassSchema);
