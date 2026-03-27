const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const TimetableCard = ({ timetable = [], userRole = "student" }) => {
  const sorted = [...timetable].sort(
    (left, right) =>
      dayOrder.indexOf(left.dayOfWeek) - dayOrder.indexOf(right.dayOfWeek) ||
      left.startTime.localeCompare(right.startTime)
  );

  const grouped = dayOrder
    .map((day) => ({
      day,
      slots: sorted.filter((slot) => slot.dayOfWeek === day)
    }))
    .filter((item) => item.slots.length);

  const weeklyHours = sorted.reduce((sum, slot) => {
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);
    return sum + ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
  }, 0);

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Timetable</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          {userRole === "teacher" ? "Subject-wise faculty timetable" : "Weekly academic schedule"}
        </h3>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)]">
          Weekly load: {weeklyHours.toFixed(1)} hrs
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {grouped.length ? (
          grouped.map((group) => (
            <div key={group.day} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">{group.day}</p>
              <div className="mt-3 space-y-3">
                {group.slots.map((slot) => (
                  <div key={slot.id} className="subtle-card rounded-2xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{slot.title}</p>
                        <p className="mt-1 text-sm text-muted">
                          {userRole === "teacher" ? slot.courseTitle || "Faculty slot" : slot.courseTitle || slot.teacherName}
                        </p>
                        {userRole === "teacher" ? (
                          <p className="mt-1 text-xs text-muted">Faculty room: {slot.room}</p>
                        ) : null}
                      </div>
                      <div className="text-right text-sm text-muted">
                        <p>{slot.startTime} - {slot.endTime}</p>
                        <p>{slot.room}</p>
                        {userRole !== "teacher" ? <p>{slot.teacherName}</p> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
            No timetable slots available yet.
          </div>
        )}
      </div>
    </div>
  );
};
