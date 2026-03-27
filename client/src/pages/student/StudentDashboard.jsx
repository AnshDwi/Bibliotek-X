import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import { SparkAreaChart } from "../../components/charts/SparkAreaChart.jsx";
import { Badge } from "../../components/common/Badge.jsx";
import { LeaderboardCard } from "../../components/common/LeaderboardCard.jsx";
import { MetricCard } from "../../components/common/MetricCard.jsx";
import { NotificationList } from "../../components/common/NotificationList.jsx";
import { SectionHeader } from "../../components/common/SectionHeader.jsx";
import { NextActionCard } from "../../components/student/NextActionCard.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

export const StudentDashboard = () => {
  const { user: authUser } = useAuth();
  const { analytics, leaderboard, notifications, nextAction, navigateToSection, user: activeUser, teacher } = useOutletContext();
  const isTeacher = activeUser.role === "teacher";

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          label={isTeacher ? "Class engagement" : "Learning efficiency"}
          value={isTeacher ? teacher?.overview?.engagementScore || analytics.efficiencyScore : analytics.efficiencyScore}
          suffix="%"
          hint="Live score"
        />
        <MetricCard
          label={isTeacher ? "Attendance rate" : "Focus score"}
          value={isTeacher ? teacher?.overview?.attendanceRate || 0 : activeUser.learningProfile.focusScore}
          hint="Updated"
          tone="success"
        />
        <MetricCard
          label={isTeacher ? "Risk alerts" : "Dropout risk"}
          value={isTeacher ? teacher?.overview?.dropoutRiskCount || 0 : activeUser.learningProfile.dropoutRisk}
          hint="Monitor"
          tone="alert"
        />
        <MetricCard
          label={isTeacher ? "Students tracked" : "XP"}
          value={isTeacher ? teacher?.overview?.students || 0 : activeUser.xp}
          hint={isTeacher ? `${teacher?.overview?.courses || 0} courses` : `${activeUser.streak} day streak`}
          tone="success"
        />
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-card rounded-3xl p-6">
          <SectionHeader
            eyebrow="Overview"
            title={isTeacher ? `Faculty workspace for ${activeUser.name}` : `Welcome back, ${activeUser.name}`}
            description={
              isTeacher
                ? "Track class health, announcements, attendance, and operations from the role-based campus system."
                : "Use this home page for your next action, alerts, and a fast view of performance."
            }
            action={<Badge tone="success">{authUser?.role || activeUser.role}</Badge>}
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="subtle-card rounded-3xl p-4">
              <p className="text-sm text-muted">{isTeacher ? "Class performance" : "Quiz performance"}</p>
              <SparkAreaChart data={analytics.recentQuizScores} color="#60a5fa" />
            </div>
            <div className="subtle-card rounded-3xl p-4">
              <p className="text-sm text-muted">{isTeacher ? "Engagement trend" : "Focus progression"}</p>
              <SparkAreaChart data={analytics.recentFocusScores} color="#22d3ee" />
            </div>
          </div>
          <div className="mt-6">
            <NextActionCard nextAction={nextAction} onNavigate={navigateToSection} />
          </div>
        </div>
        <NotificationList notifications={notifications} onNavigate={navigateToSection} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Portal navigation</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Move into dedicated academic pages</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Courses", path: "/courses", description: "Open subject workspaces, resources, and submissions." },
              { label: "Knowledge Graph", path: "/knowledge-graph", description: "Explore topics, prerequisites, quizzes, and AI study tools." },
              { label: "Analytics", path: "/analytics", description: "Review performance, attendance, and digital twin insights." },
              { label: "Focus Mode", path: "/focus-mode", description: "Use the adaptive Pomodoro and track focus quality." },
              { label: "Collaboration", path: "/collaboration", description: "Chat with your room and share quick notes." },
              { label: "Exams", path: "/exams", description: "Check exam schedule and hall-ticket details." },
              { label: "Fees", path: "/fees", description: "Review term fee status and payment records." },
              { label: "Documents", path: "/documents", description: "Submit bonafide, transcript, and admin requests." },
              { label: "ID Card", path: "/id-card", description: "Open your digital college identity card." },
              { label: "Hostel", path: "/hostel", description: "Check hostel pass validity and room assignment." },
              { label: "Transport", path: "/transport", description: "Review route assignment and bus pass status." },
              { label: "Placements", path: "/placements", description: "Track placement drives and offer status." },
              { label: "Internships", path: "/internships", description: "Review internship status and mentors." },
              { label: "Library", path: "/library", description: "Track issued books, due dates, and fines." },
              { label: "Leave", path: "/leave", description: "Submit leave requests or review them as faculty." },
              { label: "Admin Queue", path: "/admin-queue", description: "See pending admin tasks and approvals." },
              { label: "Results", path: "/results", description: "View published assessment outcomes separately." },
              { label: "Campus", path: "/campus", description: "Check timetable, announcements, reports, and teacher operations." }
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigateToSection(item.path)}
                className="subtle-card rounded-3xl p-4 text-left transition hover:translate-y-[-2px]"
              >
                <p className="font-semibold text-[var(--text-primary)]">{item.label}</p>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
        <LeaderboardCard leaderboard={leaderboard} />
      </section>
    </div>
  );
};
