export const AttendanceRiskPanel = ({ attendanceSummary, resultsSummary, userRole = "student", teacher }) => {
  const shortage = userRole === "teacher"
    ? (teacher?.attendance?.lowAttendanceAlerts || []).length
    : (attendanceSummary?.attendanceRate || 0) < 75;

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Academic standing</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Attendance shortage and progression status</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {userRole === "teacher" ? "Low attendance cases" : "Attendance status"}
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
            {userRole === "teacher" ? shortage : `${attendanceSummary?.attendanceRate || 0}%`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {userRole === "teacher"
              ? "Students below the 75% threshold"
              : shortage ? "Shortage notice active" : "Attendance within safe range"}
          </p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Backlogs</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{resultsSummary?.backlogCount || 0}</p>
          <p className="mt-1 text-sm text-muted">Subjects requiring review</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Promotion status</p>
          <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">{resultsSummary?.promotionStatus || "Pending"}</p>
          <p className="mt-1 text-sm text-muted">Semester progression snapshot</p>
        </div>
      </div>
      {userRole === "teacher" && teacher?.attendance?.lowAttendanceAlerts?.length ? (
        <div className="mt-5 space-y-3">
          {teacher.attendance.lowAttendanceAlerts.slice(0, 4).map((student) => (
            <div key={student.id} className="rounded-2xl border border-rose-400/15 bg-rose-500/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-[var(--text-primary)]">{student.name}</p>
                <span className="text-sm text-rose-300">{student.attendanceRate}%</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                Escalation recommended. Combine mentor outreach with a guardian meeting if the trend continues.
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
