import { User } from "../models/User.js";
import { verifyAccessToken } from "../services/auth.service.js";
import { ApiError } from "../utils/api-error.js";

export const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden"));
  }
  return next();
};

