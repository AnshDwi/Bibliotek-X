import { useMemo, useState } from "react";

import { Badge } from "../common/Badge.jsx";

const QUESTION_BANK = [
  {
    topic: "Transformers",
    difficulty: 1,
    prompt: "Which transformer mechanism weighs tokens dynamically?",
    options: ["Self-attention", "Pooling", "Normalization", "Epoching"],
    answer: "Self-attention"
  },
  {
    topic: "Knowledge Graph",
    difficulty: 1,
    prompt: "What does a knowledge graph capture best?",
    options: ["Topic relationships", "Video rendering", "Database backups", "Speech gain"],
    answer: "Topic relationships"
  },
  {
    topic: "Embeddings",
    difficulty: 1,
    prompt: "Why are embeddings useful in learning systems?",
    options: ["They map meaning into vectors", "They compress videos", "They replace databases", "They create JWTs"],
    answer: "They map meaning into vectors"
  },
  {
    topic: "Gradient Descent",
    difficulty: 2,
    prompt: "What usually happens when the learning rate is too high?",
    options: ["Training overshoots minima", "The model always converges faster", "Accuracy locks immediately", "The dataset shrinks"],
    answer: "Training overshoots minima"
  },
  {
    topic: "Adaptive Learning",
    difficulty: 2,
    prompt: "An adaptive engine should do what after repeated wrong answers?",
    options: ["Lower complexity and suggest prerequisites", "Hide all quizzes", "Only increase timer length", "Disable analytics"],
    answer: "Lower complexity and suggest prerequisites"
  },
  {
    topic: "Chunking",
    difficulty: 2,
    prompt: "Why does chunk size matter in content retrieval?",
    options: ["It affects relevance and context quality", "It changes JWT expiry", "It only changes CSS rendering", "It removes the need for search"],
    answer: "It affects relevance and context quality"
  },
  {
    topic: "Evaluation",
    difficulty: 3,
    prompt: "Which signal best measures whether a suggested next topic was helpful?",
    options: ["Subsequent mastery improvement", "Browser width", "File upload count", "Theme preference"],
    answer: "Subsequent mastery improvement"
  },
  {
    topic: "Focus Analytics",
    difficulty: 3,
    prompt: "Which pattern is the strongest burnout warning?",
    options: ["Long sessions plus falling focus score", "Short stable sessions", "High scores with low tab switches", "Consistent attendance"],
    answer: "Long sessions plus falling focus score"
  }
];

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export const AdaptiveQuizCard = ({ nextTopics = [] }) => {
  const [answers, setAnswers] = useState({});
  const [difficulty, setDifficulty] = useState(2);
  const [score, setScore] = useState(null);
  const [round, setRound] = useState(0);

  const prioritizedTopics = nextTopics.map((topic) => topic.toLowerCase());

  const questions = useMemo(() => {
    const pool = QUESTION_BANK.filter((question) => question.difficulty <= difficulty + 1);
    const prioritized = pool.filter((question) =>
      prioritizedTopics.some((topic) => question.topic.toLowerCase().includes(topic.toLowerCase()))
    );
    const remaining = pool.filter((question) => !prioritized.includes(question));
    return shuffle([...prioritized, ...remaining]).slice(0, 3);
  }, [difficulty, prioritizedTopics, round]);

  const submit = () => {
    const correct = questions.filter((question) => answers[question.prompt] === question.answer).length;
    const nextScore = Math.round((correct / questions.length) * 100);
    setScore(nextScore);
    setDifficulty(nextScore >= 80 ? 3 : nextScore >= 50 ? 2 : 1);
  };

  const nextRound = () => {
    setAnswers({});
    setScore(null);
    setRound((current) => current + 1);
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Adaptive Quiz Engine</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Live difficulty calibration</h3>
        </div>
        <Badge tone="info">Difficulty {difficulty}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {nextTopics.slice(0, 3).map((topic) => (
          <Badge key={topic} tone="success">
            Next: {topic}
          </Badge>
        ))}
      </div>
      <div className="mt-6 space-y-5">
        {questions.map((question) => (
          <div key={question.prompt} className="subtle-card rounded-2xl p-4">
            <p className="font-medium text-[var(--text-primary)]">{question.prompt}</p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers((current) => ({ ...current, [question.prompt]: option }))}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    answers[question.prompt] === option
                      ? "border-sky-400 bg-sky-400/10 text-[var(--text-primary)]"
                      : "border-white/10 bg-white/5 text-muted hover:border-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={submit}
            className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold"
          >
            Submit adaptive round
          </button>
          <button
            type="button"
            onClick={nextRound}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-white/10"
          >
            New question set
          </button>
        </div>
        {score !== null ? <p className="text-sm text-emerald-300">Score {score}%</p> : null}
      </div>
    </div>
  );
};
