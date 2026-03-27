import sanitizeHtml from "sanitize-html";

import { Content } from "../models/Content.js";

export const listContentByCourse = async (courseId) =>
  Content.find({ course: courseId }).sort({ createdAt: -1 });

export const createContent = async (payload) =>
  Content.create({
    ...payload,
    textContent: sanitizeHtml(payload.textContent || "", {
      allowedTags: [],
      allowedAttributes: {}
    })
  });

