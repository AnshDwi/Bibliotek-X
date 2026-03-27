import { useMemo, useState } from "react";

import { api } from "../../api/http.js";

const createLocalStudyAid = (text) => {
  const sentences = text
    .split(/[.!?]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const summary = sentences.slice(0, 2).join(". ") || "Paste a passage to generate a summary.";
  const keywords = [...new Set(text.match(/\b[A-Za-z][A-Za-z-]{3,}\b/g) || [])].slice(0, 4);

  return {
    summary,
    flashcard:
      keywords[0] && keywords[1]
        ? `What connects ${keywords[0]} and ${keywords[1]} in this lesson?`
        : "Add more content to generate flashcards.",
    explainPrompt: sentences[0] || ""
  };
};

export const ContentIntelligenceCard = () => {
  const [input, setInput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const studyAid = useMemo(() => createLocalStudyAid(input), [input]);

  const handleExplain = async () => {
    if (!input.trim()) {
      setExplanation("Paste or type some content first, then ask for an explanation.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/content/explain", {
        selection: studyAid.explainPrompt || input
      });
      setExplanation(response.data.explanation || "No explanation returned.");
    } catch (_error) {
      setExplanation("Explain-this is unavailable right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Smart content intelligence</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Summaries, notes, flashcards, explain-this</h3>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste notes, PDF text, or a course passage to generate learning aids"
        className="premium-input mt-5 min-h-32 w-full rounded-2xl px-4 py-3"
      />
      <div className="mt-5 grid gap-3 text-sm text-[var(--text-primary)]">
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Summary</p>
          <p className="mt-2">{studyAid.summary}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Flashcard</p>
          <p className="mt-2">{studyAid.flashcard}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Explain this</p>
              <p className="mt-2 text-sm text-[var(--text-primary)]">
                {explanation || "Ask the AI to explain the first important idea from your pasted content."}
              </p>
            </div>
            <button type="button" onClick={handleExplain} className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
              {loading ? "Explaining..." : "Explain"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
