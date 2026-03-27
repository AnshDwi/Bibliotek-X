const QUESTION_BANK = [
  {
    topic: "Neural Networks",
    prompt: "Which function introduces non-linearity in a neural network?",
    options: ["Activation function", "Loss function", "Optimizer", "Epoch counter"],
    correctOption: "Activation function",
    difficulty: 1
  },
  {
    topic: "Gradient Descent",
    prompt: "What happens if the learning rate is too high?",
    options: ["It may overshoot minima", "Training becomes more stable", "Accuracy locks at 100%", "Nothing changes"],
    correctOption: "It may overshoot minima",
    difficulty: 2
  },
  {
    topic: "Transformers",
    prompt: "What lets transformers weigh different tokens differently?",
    options: ["Self-attention", "Pooling", "Dropout", "Normalization"],
    correctOption: "Self-attention",
    difficulty: 3
  }
];

export const generateAdaptiveQuiz = (difficulty = 1) =>
  QUESTION_BANK.filter((question) => question.difficulty <= difficulty + 1).slice(0, 3);

export const scoreAdaptiveQuiz = (answers = []) => {
  const detailed = answers.map((answer) => {
    const question = QUESTION_BANK.find((item) => item.prompt === answer.prompt);
    const isCorrect = question?.correctOption === answer.selectedOption;
    return {
      ...answer,
      correctOption: question?.correctOption,
      difficulty: question?.difficulty || 1,
      isCorrect
    };
  });

  const rawScore = detailed.length
    ? (detailed.filter((item) => item.isCorrect).length / detailed.length) * 100
    : 0;

  const nextDifficulty =
    rawScore >= 80 ? 3 : rawScore >= 50 ? 2 : 1;

  return {
    answers: detailed,
    score: Math.round(rawScore),
    nextDifficulty
  };
};

