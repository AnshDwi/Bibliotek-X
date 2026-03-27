import path from "path";

import { createContent, listContentByCourse } from "../services/content.service.js";
import {
  explainSelection,
  summarizeContent
} from "../services/ai/content-intelligence.service.js";
import { buildKnowledgeGraph } from "../services/graph/knowledge-graph.service.js";

export const getCourseContent = async (req, res) => {
  const content = await listContentByCourse(req.params.courseId);
  res.json({ content });
};

export const postContent = async (req, res) => {
  const fileUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : req.body.fileUrl || "";
  const intelligence = await summarizeContent(req.body.textContent || req.body.description || "");
  const knowledgeGraph = buildKnowledgeGraph(intelligence.topics);

  const content = await createContent({
    ...req.body,
    course: req.params.courseId,
    uploadedBy: req.user._id,
    fileUrl,
    summary: intelligence.summary,
    flashcards: intelligence.flashcards,
    extractedTopics: intelligence.topics
  });

  res.status(201).json({
    content,
    knowledgeGraph
  });
};

export const postExplain = async (req, res) => {
  const result = await explainSelection(req.body.selection);
  res.json(result);
};
