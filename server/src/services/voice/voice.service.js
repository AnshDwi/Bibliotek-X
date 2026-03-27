const VOICE_RESPONSES = [
  {
    keywords: ["knowledge graph", "graph"],
    response:
      "A knowledge graph maps topics and their relationships. Start with the prerequisite node, then follow dependency links toward the concept you are struggling with."
  },
  {
    keywords: ["transformer", "attention", "embedding"],
    response:
      "Transformers use self-attention to compare tokens in context. Embeddings convert words or concepts into vectors so the model can reason about similarity."
  },
  {
    keywords: ["attendance"],
    response:
      "Open the Campus or Analytics page to review attendance details. Present counts fully help your rate, while late entries contribute partially."
  },
  {
    keywords: ["assignment", "submission", "deadline"],
    response:
      "Go to Courses, open the course workspace, and use the assignment submission field. Add your document link and notes before the due date shown there."
  },
  {
    keywords: ["quiz", "adaptive"],
    response:
      "The adaptive quiz changes difficulty based on your last round. If you get stuck, review the weakest linked topic in the knowledge graph before retrying."
  },
  {
    keywords: ["focus", "pomodoro", "burnout"],
    response:
      "Use the Focus Mode page to keep sessions shorter and more consistent. If focus is dropping, reduce session length and take a recovery break before the next cycle."
  }
];

const getFallbackResponse = (question) =>
  `Here is a quick answer to your doubt: ${question}. Start with the core definition, connect it to the course module, and then practise one example before moving on.`;

export const buildVoiceResponse = async ({ question }) => {
  const normalized = (question || "").toLowerCase();
  const matched = VOICE_RESPONSES.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  return {
    transcript: question,
    response: matched?.response || getFallbackResponse(question),
    audioEnabled: true
  };
};
