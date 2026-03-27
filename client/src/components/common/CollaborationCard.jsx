import { useEffect, useMemo, useState } from "react";

import { api } from "../../api/http.js";

export const CollaborationCard = ({ user }) => {
  const roomId = useMemo(() => (user?.role === "teacher" ? "faculty-room" : "student-hub"), [user?.role]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    api
      .get(`/collaboration/rooms/${roomId}/messages`)
      .then((response) => {
        if (mounted) {
          setMessages(response.data.messages || []);
        }
      })
      .catch(() => {
        if (mounted) {
          setMessages([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (!draft.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/collaboration/rooms/${roomId}/messages`, {
        text: draft
      });
      setMessages((current) => [...current, response.data.message]);
      setDraft("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Realtime collaboration</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Live chat and shared notes</h3>
      <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
        {messages.length ? (
          messages.map((message) => (
            <div key={message._id || `${message.sender?.name}-${message.createdAt}`} className="subtle-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted">{message.sender?.name || "User"}</p>
                <p className="text-xs text-muted">
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Now"}
                </p>
              </div>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{message.text}</p>
            </div>
          ))
        ) : (
          <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
            No messages yet. Start the room conversation from here.
          </div>
        )}
      </div>
      <div className="mt-4 space-y-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={user?.role === "teacher" ? "Post an update for your learners" : "Ask a doubt or add a shared note"}
          className="premium-input min-h-24 w-full rounded-2xl px-4 py-3"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold"
        >
          {loading ? "Sending..." : "Send message"}
        </button>
      </div>
    </div>
  );
};
