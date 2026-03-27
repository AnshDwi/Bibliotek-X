const statusStyles = {
  present: "bg-emerald-500/25 text-emerald-200 border-emerald-400/25",
  absent: "bg-rose-500/25 text-rose-200 border-rose-400/25",
  late: "bg-amber-500/25 text-amber-200 border-amber-400/25",
  empty: "bg-white/5 text-[var(--text-secondary)] border-white/10"
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildCalendarCells = (attendanceCalendar) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const cells = [];
  const statusByDay = new Map();

  attendanceCalendar.forEach((entry) => {
    const date = new Date(entry.date);
    if (date.getFullYear() === year && date.getMonth() === month) {
      statusByDay.set(date.getDate(), entry);
    }
  });

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    cells.push({ key: `empty-start-${index}`, empty: true });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const entry = statusByDay.get(day);
    cells.push({
      key: `day-${day}`,
      day,
      entry,
      status: entry?.status || "empty"
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `empty-end-${cells.length}`, empty: true });
  }

  return {
    monthLabel: firstDay.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    cells
  };
};

export const StudentAttendanceCalendar = ({
  attendanceCalendar = [],
  attendanceSummary = {
    totalClasses: 0,
    presentClasses: 0,
    lateClasses: 0,
    absentClasses: 0,
    attendanceRate: 0
  }
}) => {
  const { monthLabel, cells } = buildCalendarCells(attendanceCalendar);

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Attendance record</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Monthly attendance calendar</h3>
          <p className="mt-2 text-sm text-muted">Check your attendance status the same way you would on a college portal.</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Attendance rate</p>
          <p className="mt-1 text-2xl font-bold text-white">{attendanceSummary.attendanceRate}%</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Total classes</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{attendanceSummary.totalClasses}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Present</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{attendanceSummary.presentClasses}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Late</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">{attendanceSummary.lateClasses}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Absent</p>
          <p className="mt-2 text-2xl font-bold text-rose-300">{attendanceSummary.absentClasses}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/25 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-semibold text-[var(--text-primary)]">{monthLabel}</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-400/25 bg-emerald-500/20 px-3 py-1 text-emerald-200">Present</span>
            <span className="rounded-full border border-amber-400/25 bg-amber-500/20 px-3 py-1 text-amber-200">Late</span>
            <span className="rounded-full border border-rose-400/25 bg-rose-500/20 px-3 py-1 text-rose-200">Absent</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-muted">
          {dayLabels.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell) => (
            <div
              key={cell.key}
              className={`min-h-20 rounded-2xl border p-2 text-sm transition ${cell.empty ? "border-transparent bg-transparent" : statusStyles[cell.status]}`}
            >
              {!cell.empty ? (
                <div className="flex h-full flex-col justify-between">
                  <span className="font-semibold">{cell.day}</span>
                  <div className="mt-2 text-[11px] leading-relaxed opacity-90">
                    {cell.entry ? cell.entry.courseTitle : "No class"}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {attendanceCalendar.length ? (
          attendanceCalendar
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((entry) => (
              <div key={`${entry.date}-${entry.courseTitle}`} className={`rounded-2xl border p-4 ${statusStyles[entry.status]}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{entry.courseTitle}</p>
                    <p className="mt-1 text-sm opacity-80">
                      {new Date(entry.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold uppercase">
                    {entry.status}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
            Attendance entries will appear here once your teachers mark them.
          </div>
        )}
      </div>
    </div>
  );
};
