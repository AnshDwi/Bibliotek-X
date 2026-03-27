import { api } from "../../api/http.js";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useOutletContext } from "react-router-dom";

export const ExamsPage = () => {
  const { exams, user } = useOutletContext();
  const isTeacher = user.role === "teacher";

  const downloadHallTicket = async (exam) => {
    const response = await api.get(`/portal/exams/${exam.id}/hall-ticket.pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `bibliotek-x-${exam.title.toLowerCase().replace(/\s+/g, "-")}-hall-ticket.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadSeatAllotment = async (exam) => {
    const response = await api.get(`/portal/exams/${exam.id}/seat-allotment.pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `bibliotek-x-${exam.title.toLowerCase().replace(/\s+/g, "-")}-seat-allotment.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Examinations"
        title={isTeacher ? "Exam schedule and invigilation view" : "Exam schedule and hall tickets"}
        description="Check upcoming exams, room allocation, and hall-ticket style access details for each paper."
        breadcrumbs={["Portal", "Exams"]}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {exams.length ? (
          exams.map((exam) => (
            <div key={exam.id} className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted">{exam.courseTitle}</p>
              <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{exam.title}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  Date: {new Date(exam.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  Time: {exam.startTime} - {exam.endTime}
                </div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  Room: {exam.room}
                </div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  Hall Ticket: {exam.hallTicketCode}
                </div>
              </div>
              {!isTeacher ? (
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted">Seat number: {exam.seatNumber}</p>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => downloadHallTicket(exam)} className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
                      Download hall ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSeatAllotment(exam)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      Seat allotment
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No exams are scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
};
