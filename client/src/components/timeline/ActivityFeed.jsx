const items = [
  "Explain-this used on retrieval chunking note",
  "Focus session completed with 77 score",
  "Adaptive quiz difficulty upgraded to level 3",
  "Teacher Tara joined live collaboration room"
];

export const ActivityFeed = ({ user, notifications = [] }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">Activity trail</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Recent system signals</h3>
    <div className="mt-5 space-y-3">
      {[...notifications.slice(0, 2).map((item) => item.title), `${user.name} profile synced from live API`, ...items]
        .slice(0, 4)
        .map((item, index) => (
        <div
          key={item}
          className="subtle-card rounded-2xl px-4 py-3 text-sm text-[var(--text-primary)]"
        >
          <span className="mr-3 text-sky-300">0{index + 1}</span>
          {item}
        </div>
      ))}
    </div>
  </div>
);
