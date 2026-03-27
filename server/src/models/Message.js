import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    messageType: { type: String, default: "text" }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

