import { useOutletContext } from "react-router-dom";

import { AttendanceRiskPanel } from "../../components/portal/AttendanceRiskPanel.jsx";
import { SparkAreaChart } from "../../components/charts/SparkAreaChart.jsx";
import { StudentAttendanceCalendar } from "../../components/student/StudentAttendanceCalendar.jsx";
import { ReportCardPanel } from "../../components/portal/ReportCardPanel.jsx";
import { TeacherInsightsGrid } from "../../components/teacher/TeacherInsightsGrid.jsx";
import { StudentInsightsTable } from "../../components/teacher/StudentInsightsTable.jsx";

export const AnalyticsPage = () => {
  const { analytics, attendanceCalendar, attendanceSummary, resultsSummary, teacher, user: activeUser } = useOutletContext();
  const isTeacher = activeUser.role === "teacher";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Performance analytics</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Scores and engagement trends</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="subtle-card rounded-3xl p-4">
              <p className="text-sm text-muted">Quiz performance</p>
              <SparkAreaChart data={analytics.recentQuizScores} color="#60a5fa" />
            </div>
            <div className="subtle-card rounded-3xl p-4">
              <p className="text-sm text-muted">Focus progression</p>
              <SparkAreaChart data={analytics.recentFocusScores} color="#22d3ee" />
            </div>
          </div>
        </div>
        <ReportCardPanel
          user={activeUser}
          analytics={analytics}
          teacher={teacher}
          attendanceSummary={attendanceSummary}
        />
      </section>

      <StudentAttendanceCalendar attendanceCalendar={attendanceCalendar} attendanceSummary={attendanceSummary} />
      <AttendanceRiskPanel
        attendanceSummary={attendanceSummary}
        resultsSummary={resultsSummary}
        userRole={activeUser.role}
        teacher={teacher}
      />

      {isTeacher ? (
        <>
          <TeacherInsightsGrid teacher={teacher} />
          <StudentInsightsTable teacher={teacher} />
        </>
      ) : null}
    </div>
  );
};
