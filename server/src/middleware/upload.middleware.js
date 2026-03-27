import fs from "fs";
import path from "path";

import multer from "multer";
import { v4 as uuid } from "uuid";

import { env } from "../config/env.js";

const uploadDir = path.resolve(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${uuid()}-${file.originalname.replace(/\s+/g, "-")}`)
});

const allowedMimeTypes = [
  "application/pdf",
  "video/mp4",
  "video/webm",
  "text/plain"
];

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    return cb(null, true);
  }
});

