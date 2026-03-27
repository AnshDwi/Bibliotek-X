export const TeacherInsightsGrid = ({ teacher }) => (
  <div className="grid gap-6 xl:grid-cols-2">
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Attendance management</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Class attendance pulse</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Present</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">{teacher.attendance?.presentCount ?? 0}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Late</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">{teacher.attendance?.lateCount ?? 0}</p>
        </div>
        <div className="subtle-card rounded-2xl p-4">
          <p className="text-sm text-muted">Absent</p>
          <p className="mt-2 text-2xl font-bold text-rose-300">{teacher.attendance?.absentCount ?? 0}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {(teacher.attendance?.lowAttendanceAlerts || []).slice(0, 3).map((student) => (
          <div key={student.id} className="subtle-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-[var(--text-primary)]">{student.name}</p>
              <span className="text-sm text-rose-300">{student.attendanceRate}% attendance</span>
            </div>
            <p className="mt-2 text-sm text-muted">Low attendance alert. Consider parent outreach or intervention.</p>
          </div>
        ))}
        {(teacher.attendance?.recentRegisters || []).slice(0, 3).map((record) => (
          <div key={record.id} className="subtle-card rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{record.courseTitle}</p>
                <p className="mt-1 text-sm text-muted">
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>
              <div className="text-right text-xs text-muted">
                <p>Present {record.presentCount}</p>
                <p>Late {record.lateCount}</p>
                <p>Absent {record.absentCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Class health dashboard</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Weak topics and engagement</h3>
      <div className="mt-5 space-y-3">
        {(teacher.classHealth?.weakTopics || []).map((item) => (
          <div key={item.topic} className="subtle-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-[var(--text-primary)]">{item.topic}</p>
              <span className="text-sm text-cyan-300">{item.count} learners flagged</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Assignments and evaluation</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Recent assignments</h3>
      <div className="mt-5 space-y-3">
        {(teacher.assignments || []).slice(0, 4).map((assignment) => (
          <div key={assignment.id} className="subtle-card rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{assignment.title}</p>
                <p className="mt-1 text-sm text-muted">{assignment.course}</p>
              </div>
              <span className="text-sm text-cyan-300">{assignment.submissions} submissions</span>
            </div>
            <p className="mt-2 text-sm text-muted">Avg score {assignment.averageScore || 0}% | {assignment.type}</p>
            {assignment.submissionDetails?.length ? (
              <div className="mt-3 space-y-2">
                {assignment.submissionDetails.slice(0, 3).map((submission) => (
                  <div key={`${assignment.id}-${submission.studentId}`} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[var(--text-primary)]">{submission.studentName}</p>
                      <span className="text-xs text-muted">
                        {submission.score ? `Score ${submission.score}` : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{submission.feedback || "Awaiting review"}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Live class system</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Sessions, transcript, notes</h3>
      <div className="mt-5 space-y-3">
        {(teacher.liveSessions || []).slice(0, 4).map((session) => (
          <div key={session.id} className="subtle-card rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{session.title}</p>
                <p className="mt-1 text-sm text-muted">{session.course}</p>
              </div>
              <span className="text-sm text-emerald-300">{session.status}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{session.notes}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
