import {
  createNotification,
  listNotifications,
  markNotificationRead
} from "../services/notification/notification.service.js";

export const getNotifications = async (req, res) => {
  const notifications = await listNotifications(req.user._id);
  res.json({ notifications });
};

export const postNotification = async (req, res) => {
  const notification = await createNotification({
    ...req.body,
    user: req.body.userId || req.user._id
  });

  res.status(201).json({ notification });
};

export const patchNotificationRead = async (req, res) => {
  const notification = await markNotificationRead({
    notificationId: req.params.id,
    userId: req.user._id
  });

  res.json({ notification });
};
