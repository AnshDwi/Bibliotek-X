import { ROLES } from "../constants/roles.js";
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  updateUserProfile
} from "../services/auth.service.js";

const toUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  headline: user.headline,
  avatarUrl: user.avatarUrl,
  department: user.department,
  program: user.program,
  academicYear: user.academicYear,
  rollNumber: user.rollNumber,
  parentContact: user.parentContact,
  learningProfile: user.learningProfile,
  xp: user.xp,
  streak: user.streak,
  badges: user.badges
});

export const register = async (req, res) => {
  const user = await registerUser({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || ROLES.STUDENT
  });

  res.status(201).json({
    user: toUserPayload(user)
  });
};

export const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({
    accessToken,
    user: toUserPayload(user)
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  const session = await refreshSession(refreshToken);
  res.json(session);
};

export const me = async (req, res) => {
  res.json({
    user: toUserPayload(req.user)
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  await logoutUser(req.user._id, refreshToken);
  res.clearCookie("refreshToken");
  res.status(204).send();
};

export const updateMe = async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body);
  res.json({
    user: toUserPayload(user)
  });
};
