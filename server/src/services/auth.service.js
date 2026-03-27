import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/api-error.js";

const signAccessToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn
  });

const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });

const logAttempt = async ({ userId, action, metadata = {} }) => {
  await ActivityLog.create({
    user: userId,
    action,
    entityType: "auth",
    entityId: userId ? String(userId) : "",
    metadata
  });
};

const issueSessionTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokens.push({ token: refreshToken });
  user.lastActiveAt = new Date();
  await user.save();

  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    await logAttempt({
      action: "auth.login.failed",
      metadata: { email, reason: "user-not-found" }
    });
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    await logAttempt({
      userId: user._id,
      action: "auth.login.failed",
      metadata: { email, reason: "invalid-password" }
    });
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await issueSessionTokens(user);
  await logAttempt({
    userId: user._id,
    action: "auth.login.success",
    metadata: { email: user.email, role: user.role }
  });

  return { user, accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const exists = user.refreshTokens.some((item) => item.token === refreshToken);
    if (!exists) {
      throw new ApiError(401, "Refresh token revoked");
    }

    return {
      accessToken: signAccessToken(user),
      refreshToken
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid refresh token");
  }
};

export const logoutUser = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    return;
  }

  user.refreshTokens = user.refreshTokens.filter((item) => item.token !== refreshToken);
  await user.save();
};

export const updateUserProfile = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = payload.name ?? user.name;
  user.headline = payload.headline ?? user.headline;
  user.avatarUrl = payload.avatarUrl ?? user.avatarUrl;
  user.department = payload.department ?? user.department;
  user.program = payload.program ?? user.program;
  user.academicYear = payload.academicYear ?? user.academicYear;
  user.rollNumber = payload.rollNumber ?? user.rollNumber;
  user.parentContact = {
    ...user.parentContact?.toObject?.(),
    ...(payload.parentContact || {})
  };

  await user.save();
  return user;
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtAccessSecret);
  } catch (_error) {
    throw new ApiError(401, "Invalid access token");
  }
};
