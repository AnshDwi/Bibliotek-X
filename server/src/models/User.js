import mongoose from "mongoose";

import { ROLE_OPTIONS, ROLES } from "../constants/roles.js";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const masterySchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    score: { type: Number, default: 0 },
    trend: { type: String, default: "stable" }
  },
  { _id: false }
);

const learningProfileSchema = new mongoose.Schema(
  {
    timeSpentMinutes: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    learningSpeed: { type: Number, default: 1 },
    focusScore: { type: Number, default: 0 },
    weakAreas: { type: [String], default: [] },
    strongAreas: { type: [String], default: [] },
    dropoutRisk: { type: String, default: "low" },
    nextBestTopics: { type: [String], default: [] },
    masteryMap: { type: [masterySchema], default: [] }
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const parentContactSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLE_OPTIONS, default: ROLES.STUDENT },
    avatarUrl: { type: String, default: "" },
    headline: { type: String, default: "" },
    department: { type: String, default: "" },
    program: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    rollNumber: { type: String, default: "" },
    refreshTokens: { type: [refreshTokenSchema], default: [] },
    learningProfile: { type: learningProfileSchema, default: () => ({}) },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    badges: { type: [badgeSchema], default: [] },
    lastActiveAt: { type: Date, default: Date.now },
    parentContact: { type: parentContactSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
