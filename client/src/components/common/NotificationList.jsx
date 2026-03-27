const resolveNextRoute = (item) => {
  const text = `${item.title} ${item.body}`.toLowerCase();
  if (text.includes("quiz")) {
    return "/knowledge-graph";
  }
  if (text.includes("knowledge graph") || text.includes("topic")) {
    return "/knowledge-graph";
  }
  if (text.includes("feedback") || text.includes("note")) {
    return "/collaboration";
  }
  if (text.includes("attendance")) {
    return "/campus";
  }
  return "/courses";
};

export const NotificationList = ({ notifications, onNavigate }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">Realtime notifications</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Alerts, deadlines, updates</h3>
    <div className="mt-5 space-y-3">
      {notifications.map((item) => (
        <div key={item.id || item.title} className="subtle-card hover-lift rounded-2xl p-4">
          <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
          <p className="mt-2 text-sm text-muted">{item.body}</p>
          <button
            type="button"
            onClick={() => onNavigate(resolveNextRoute(item))}
            className="mt-4 text-sm font-medium text-sky-300 transition hover:text-sky-200"
          >
            See what&apos;s next
          </button>
        </div>
      ))}
    </div>
  </div>
);
