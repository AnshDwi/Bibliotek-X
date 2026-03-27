import OpenAI from "openai";

import { env } from "../../config/env.js";
import { extractTopics } from "../graph/knowledge-graph.service.js";

const fallbackSummary = (text) =>
  text
    .split(".")
    .slice(0, 3)
    .join(".")
    .trim();

const fallbackFlashcards = (topics) =>
  topics.slice(0, 5).map((topic) => ({
    question: `What is the key idea behind ${topic}?`,
    answer: `${topic} is an important concept in this learning path.`
  }));

let client = null;
if (env.openAiApiKey) {
  client = new OpenAI({ apiKey: env.openAiApiKey });
}

export const summarizeContent = async (content) => {
  if (!client) {
    const topics = extractTopics(content);
    return {
      summary: fallbackSummary(content),
      notes: `Key ideas: ${topics.join(", ")}`,
      flashcards: fallbackFlashcards(topics),
      topics
    };
  }

  const prompt = `Summarize the following learning content. Generate a concise summary, short notes, five flashcards, and a topic list.\n\n${content}`;
  const response = await client.responses.create({
    model: env.openAiModel,
    input: prompt
  });

  const text = response.output_text || "";
  const topics = extractTopics(text);
  return {
    summary: text.slice(0, 500),
    notes: text,
    flashcards: fallbackFlashcards(topics),
    topics
  };
};

export const explainSelection = async (selection) => {
  if (!client) {
    return {
      explanation: `Explain-this mode: ${selection}. This would be expanded with OpenAI in production.`
    };
  }

  const response = await client.responses.create({
    model: env.openAiModel,
    input: `Explain the following learning concept in simple but precise language: ${selection}`
  });

  return {
    explanation: response.output_text
  };
};

