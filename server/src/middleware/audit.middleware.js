import { ActivityLog } from "../models/ActivityLog.js";

export const audit = (action, entityType = "") => async (req, _res, next) => {
  if (req.user) {
    await ActivityLog.create({
      user: req.user._id,
      action,
      entityType,
      entityId: req.params.id || "",
      metadata: {
        method: req.method,
        path: req.originalUrl
      }
    });
  }

  next();
};

