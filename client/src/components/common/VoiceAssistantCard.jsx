import { Mic, Square, Volume2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { api } from "../../api/http.js";

export const VoiceAssistantCard = () => {
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition || null,
    []
  );

  const fetchVoiceReply = async (prompt) => {
    setLoading(true);
    try {
      const apiResponse = await api.post("/voice/doubt", { question: prompt });
      setTranscript(apiResponse.data.transcript || prompt);
      setResponse(apiResponse.data.response || "No reply returned from the voice service.");
    } catch (_error) {
      setResponse("Voice reply could not be generated right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      setResponse("Voice input is not supported in this browser. You can still type your question below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const heardText = event.results?.[0]?.[0]?.transcript || "";
      setTranscript(heardText);
      setQuestion(heardText);
      fetchVoiceReply(heardText);
    };
    recognition.onerror = () => {
      setResponse("I could not capture your voice clearly. Please try again or type your doubt.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const askVoiceAssistant = async () => {
    const prompt = question.trim() || transcript.trim();
    if (!prompt) {
      setResponse("Speak or type a doubt first so I can generate an answer.");
      return;
    }

    await fetchVoiceReply(prompt);
  };

  const speakReply = () => {
    if (!response.trim()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Voice interaction</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Ask doubts by voice</h3>
      <p className="mt-3 text-sm text-muted">
        Speak a question or type one manually, then get an AI-generated answer with optional voice playback.
      </p>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask about a course concept, assignment, or doubt"
        className="premium-input mt-5 min-h-28 w-full rounded-2xl px-4 py-3"
      />
      {transcript ? (
        <div className="subtle-card mt-4 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Transcript</p>
          <p className="mt-2 text-sm text-[var(--text-primary)]">{transcript}</p>
        </div>
      ) : null}
      {response ? (
        <div className="subtle-card mt-4 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">AI reply</p>
          <p className="mt-2 text-sm text-[var(--text-primary)]">{response}</p>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {!listening ? (
          <button type="button" onClick={startListening} className="gradient-button flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold">
            <Mic className="h-4 w-4" />
            Start listening
          </button>
        ) : (
          <button type="button" onClick={stopListening} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
            <Square className="mr-2 inline h-4 w-4" />
            Stop listening
          </button>
        )}
        <button type="button" onClick={askVoiceAssistant} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-primary)] transition hover:bg-white/10">
          {loading ? "Thinking..." : "Generate answer"}
        </button>
        <button type="button" onClick={speakReply} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-primary)] transition hover:bg-white/10">
          <Volume2 className="mr-2 inline h-4 w-4" />
          Speak reply
        </button>
      </div>
    </div>
  );
};
