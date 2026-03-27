import { useOutletContext } from "react-router-dom";

import { AnnouncementsCard } from "../../components/portal/AnnouncementsCard.jsx";
import { AttendanceRiskPanel } from "../../components/portal/AttendanceRiskPanel.jsx";
import { GuardianMeetingsPanel } from "../../components/portal/GuardianMeetingsPanel.jsx";
import { ParentReportPreview } from "../../components/portal/ParentReportPreview.jsx";
import { TimetableCard } from "../../components/portal/TimetableCard.jsx";
import { TeacherOperationsPanel } from "../../components/teacher/TeacherOperationsPanel.jsx";
import { ReportCardPanel } from "../../components/portal/ReportCardPanel.jsx";

export const CampusPage = () => {
  const { announcements, analytics, attendanceSummary, meetings, navigateToSection, reload, resultsSummary, teacher, timetable, user: activeUser } = useOutletContext();
  const isTeacher = activeUser.role === "teacher";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-2">
        <TimetableCard timetable={timetable} userRole={activeUser.role} />
        <AnnouncementsCard announcements={announcements} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ReportCardPanel
          user={activeUser}
          analytics={analytics}
          teacher={teacher}
          attendanceSummary={attendanceSummary}
        />
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Campus services</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Portal administration</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Exams", path: "/exams", description: "Exam schedule and hall tickets" },
              { label: "Fees", path: "/fees", description: "Fee dues and payment records" },
              { label: "Documents", path: "/documents", description: "Bonafide, transcript, and admin requests" },
              { label: "ID Card", path: "/id-card", description: "Digital campus identity card" },
              { label: "Hostel", path: "/hostel", description: "Hostel residency and room details" },
              { label: "Transport", path: "/transport", description: "Bus route and pass validation" },
              { label: "Placements", path: "/placements", description: "Placement drives and offer tracking" },
              { label: "Internships", path: "/internships", description: "Internship status and mentor records" },
              { label: "Library", path: "/library", description: "Issued books, due dates, and fine status" },
              { label: "Leave", path: "/leave", description: "Apply for leave or review requests" },
              { label: "Admin Queue", path: "/admin-queue", description: "Pending approvals and office operations" },
              { label: "Profile", path: "/profile", description: "Settings, contact details, and profile" }
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigateToSection(item.path)}
                className="subtle-card rounded-2xl p-4 text-left text-sm text-[var(--text-primary)] transition hover:translate-y-[-2px]"
              >
                <p className="font-semibold">{item.label}</p>
                <p className="mt-2 text-muted">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AttendanceRiskPanel
          attendanceSummary={attendanceSummary}
          resultsSummary={resultsSummary}
          userRole={activeUser.role}
          teacher={teacher}
        />
        <GuardianMeetingsPanel
          meetings={meetings}
          teacher={teacher}
          reload={reload}
          userRole={activeUser.role}
        />
      </section>

      {isTeacher ? (
        <>
          <ParentReportPreview teacher={teacher} />
          <TeacherOperationsPanel teacher={teacher} onReload={reload} />
        </>
      ) : null}
    </div>
  );
};
