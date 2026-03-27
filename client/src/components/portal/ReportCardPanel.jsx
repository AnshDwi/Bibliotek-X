import { useMemo, useState } from "react";

import { api } from "../../api/http.js";

export const ReportCardPanel = ({ user, analytics, teacher, attendanceSummary }) => {
  const [selectedStudentId, setSelectedStudentId] = useState(teacher?.students?.[0]?.id || "");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const studentSummary = useMemo(
    () => ({
      learner: user?.name || "Student",
      efficiency: analytics?.efficiencyScore || 0,
      attendance: attendanceSummary?.attendanceRate || 0,
      focus: user?.learningProfile?.focusScore || 0,
      weakAreas: user?.learningProfile?.weakAreas || []
    }),
    [analytics?.efficiencyScore, attendanceSummary?.attendanceRate, user]
  );

  const downloadStudentReport = async () => {
    const response = await api.get("/portal/report-card.pdf", {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bibliotek-x-report-card.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generateTeacherReport = async (downloadPdf = false) => {
    if (!selectedStudentId) {
      return;
    }

    setLoading(true);
    try {
      if (downloadPdf) {
        const pdfResponse = await api.get(`/portal/report-card.pdf?studentId=${selectedStudentId}`, {
          responseType: "blob"
        });
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "bibliotek-x-student-report-card.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
        return;
      }

      const response = await api.get(`/teacher/reports/${selectedStudentId}`);
      setReport(response.data.report || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Reports</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Report card and performance summary</h3>

      {user?.role === "teacher" ? (
        <div className="mt-5 space-y-4">
          <select
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
            className="premium-input w-full rounded-2xl px-4 py-3"
          >
            {(teacher?.students || []).map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={generateTeacherReport} className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
            {loading ? "Generating..." : "Generate report"}
          </button>
          <button type="button" onClick={() => generateTeacherReport(true)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-white/10">
            Download PDF
          </button>
          {report ? (
            <div className="subtle-card rounded-2xl p-4">
              <p className="font-semibold text-[var(--text-primary)]">{report.studentName}</p>
              <p className="mt-2 text-sm text-muted">Attendance proxy: {report.attendance}%</p>
              <p className="mt-1 text-sm text-muted">Performance: {report.performance}%</p>
              <p className="mt-1 text-sm text-muted">Weak areas: {(report.weakAreas || []).join(", ") || "Stable"}</p>
              <div className="mt-3 rounded-2xl border border-cyan-400/10 bg-cyan-500/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Parent-ready summary</p>
                <p className="mt-2 text-sm text-[var(--text-primary)]">
                  {report.studentName} is currently showing {report.performance}% performance with an attendance proxy of {report.attendance}%. The recommended family action this week is to reinforce {(report.weakAreas || [])[0] || "core concepts"} through short, focused practice.
                </p>
                <p className="mt-2 text-sm text-muted">{report.suggestion}</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="subtle-card rounded-2xl p-4">
            <p className="font-semibold text-[var(--text-primary)]">{studentSummary.learner}</p>
            <p className="mt-2 text-sm text-muted">Learning efficiency: {studentSummary.efficiency}%</p>
            <p className="mt-1 text-sm text-muted">Attendance: {studentSummary.attendance}%</p>
            <p className="mt-1 text-sm text-muted">Focus score: {studentSummary.focus}</p>
            <p className="mt-1 text-sm text-muted">
              Weak areas: {studentSummary.weakAreas.join(", ") || "Stable"}
            </p>
          </div>
          <button type="button" onClick={downloadStudentReport} className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
            Download report card PDF
          </button>
        </div>
      )}
    </div>
  );
};
