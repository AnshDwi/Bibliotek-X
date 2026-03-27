const riskTone = {
  low: "text-emerald-300",
  medium: "text-amber-300",
  high: "text-rose-300"
};

export const ParentReportPreview = ({ teacher }) => {
  const reportRows = (teacher?.reports || []).map((item) => {
    const matchingStudent = (teacher?.students || []).find((student) => student.name === item.studentName);

    return {
      ...item,
      attendanceRate: matchingStudent?.attendanceRate ?? 0,
      averageScore: matchingStudent?.averageScore ?? 0,
      focusScore: matchingStudent?.focusScore ?? 0,
      nextBestTopic: matchingStudent?.nextBestTopics?.[0] || "guided revision",
      weakArea: matchingStudent?.weakAreas?.[0] || "core fundamentals"
    };
  });

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Parent report preview</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Guardian-friendly academic summaries</h3>
      <p className="mt-2 text-sm text-muted">
        Preview the kind of clear, plain-language update a parent would receive about progress, attendance, and the next support step.
      </p>
      <div className="mt-5 space-y-4">
        {reportRows.slice(0, 4).map((item) => (
          <div key={`${item.studentName}-${item.parentEmail}`} className="subtle-card rounded-3xl p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{item.studentName}</p>
                <p className="mt-1 text-sm text-muted">{item.parentEmail || "Parent email pending"}</p>
              </div>
              <span className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${riskTone[item.risk] || "text-sky-300"}`}>
                {item.risk} risk
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Attendance</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{item.attendanceRate}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Performance</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{item.averageScore}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Focus</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{item.focusScore}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Parent summary</p>
              <p className="mt-2 text-sm text-muted">
                {item.studentName} is currently doing best with guided work, but needs extra support in {item.weakArea}. The next recommended focus area is {item.nextBestTopic}.
              </p>
              <p className="mt-3 text-sm text-[var(--text-primary)]">{item.recommendation}</p>
            </div>
          </div>
        ))}
        {!reportRows.length ? (
          <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
            Parent-facing summaries will appear here once teacher risk reports are generated.
          </div>
        ) : null}
      </div>
    </div>
  );
};
