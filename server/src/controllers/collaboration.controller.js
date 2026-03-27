import { Message } from "../models/Message.js";

export const getMessages = async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .populate("sender", "name role")
    .sort({ createdAt: 1 });

  res.json({ messages });
};

export const postMessage = async (req, res) => {
  const message = await Message.create({
    roomId: req.params.roomId,
    sender: req.user._id,
    text: req.body.text,
    messageType: req.body.messageType || "text"
  });

  await message.populate("sender", "name role");
  res.status(201).json({ message });
};
