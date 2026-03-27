import { Notification } from "../../models/Notification.js";
import { ApiError } from "../../utils/api-error.js";

export const listNotifications = async (userId) =>
  Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(20);

export const createNotification = async (payload) => Notification.create(payload);

export const markNotificationRead = async ({ notificationId, userId }) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return notification;
};
