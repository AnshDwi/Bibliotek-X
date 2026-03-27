import { Server } from "socket.io";

import { env } from "../config/env.js";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";

export const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("chat:message", async (payload) => {
      const message = await Message.create(payload);
      io.to(payload.roomId).emit("chat:message", message);
    });

    socket.on("notification:create", async (payload) => {
      const notification = await Notification.create(payload);
      io.emit("notification:create", notification);
    });
  });

  return io;
};

