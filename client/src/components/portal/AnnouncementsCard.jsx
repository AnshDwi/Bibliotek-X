export const AnnouncementsCard = ({ announcements = [] }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">Announcements</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Campus updates and faculty notices</h3>
    <div className="mt-5 space-y-3">
      {announcements.length ? (
        announcements.slice(0, 5).map((item) => (
          <div key={item.id} className="subtle-card rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
              <span className="text-xs text-muted">
                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short"
                })}
              </span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan-200">
              {item.courseTitle || "General"} | {item.postedBy}
            </p>
          </div>
        ))
      ) : (
        <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
          No announcements posted yet.
        </div>
      )}
    </div>
  </div>
);
