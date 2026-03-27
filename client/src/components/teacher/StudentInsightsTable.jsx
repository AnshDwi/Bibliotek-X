export const StudentInsightsTable = ({ teacher }) => (
  <div className="glass-card rounded-3xl p-6">
    <p className="text-sm text-muted">Student insights</p>
    <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Digital twin view by learner</h3>
    <div className="mt-5 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-[var(--text-secondary)]">
          <tr>
            <th className="pb-3 pr-4">Student</th>
            <th className="pb-3 pr-4">Attendance</th>
            <th className="pb-3 pr-4">Avg Score</th>
            <th className="pb-3 pr-4">Focus</th>
            <th className="pb-3 pr-4">Risk</th>
            <th className="pb-3 pr-4">Weak Areas</th>
          </tr>
        </thead>
        <tbody>
          {(teacher.students || []).slice(0, 6).map((student) => (
            <tr key={student.id} className="border-t border-white/10">
              <td className="py-4 pr-4 font-medium text-[var(--text-primary)]">{student.name}</td>
              <td className="py-4 pr-4 text-muted">{student.attendanceRate}%</td>
              <td className="py-4 pr-4 text-muted">{student.averageScore}%</td>
              <td className="py-4 pr-4 text-muted">{student.focusScore}</td>
              <td className="py-4 pr-4 text-rose-300">{student.dropoutRisk}</td>
              <td className="py-4 pr-4 text-muted">{(student.weakAreas || []).slice(0, 2).join(", ") || "Stable"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
