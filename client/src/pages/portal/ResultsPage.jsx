import { api } from "../../api/http.js";
import { useOutletContext } from "react-router-dom";

import { PageHeader } from "../../components/layout/PageHeader.jsx";

export const ResultsPage = () => {
  const { results, resultsSummary } = useOutletContext();

  const downloadResultSheet = async (result) => {
    const response = await api.get(`/portal/results/${result.id}/result-sheet.pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `bibliotek-x-${result.title.toLowerCase().replace(/\s+/g, "-")}-result-sheet.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Results"
        title="Published assessment results"
        description="See graded assessments separately from pending coursework, with clear percentages and pass indicators."
        breadcrumbs={["Portal", "Results"]}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-muted">{resultsSummary.semester}</p>
          <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{resultsSummary.sgpa}</p>
          <p className="mt-1 text-sm text-muted">Current SGPA</p>
        </div>
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-muted">Cumulative</p>
          <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{resultsSummary.cgpa}</p>
          <p className="mt-1 text-sm text-muted">Estimated CGPA</p>
        </div>
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-muted">Credits earned</p>
          <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{resultsSummary.earnedCredits}</p>
          <p className="mt-1 text-sm text-muted">Published subjects</p>
        </div>
        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-muted">Passed papers</p>
          <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{resultsSummary.passCount}/{resultsSummary.publishedResults}</p>
          <p className="mt-1 text-sm text-muted">Result status</p>
        </div>
        <div className="glass-card rounded-3xl p-5 md:col-span-2 xl:col-span-4">
          <p className="text-sm text-muted">Academic progression</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xl font-bold text-[var(--text-primary)]">{resultsSummary.promotionStatus}</p>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)]">
              Backlogs: {resultsSummary.backlogCount}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {results.length ? (
          results.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{item.courseTitle}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200">{item.semester} | {item.courseCredits} credits</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
                  GP {item.gradePoint}
                </span>
              </div>
              <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  Score {item.score}/{item.maxScore}
                </div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  {item.percentage}%
                </div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">
                  {item.verdict}
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Internal</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {item.marksBreakup.internalScore}/{item.marksBreakup.internalMax}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">External</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {item.marksBreakup.externalScore}/{item.marksBreakup.externalMax}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">{item.feedback || "Feedback pending"}</p>
              <button
                type="button"
                onClick={() => downloadResultSheet(item)}
                className="mt-4 gradient-button rounded-2xl px-4 py-3 text-sm font-semibold"
              >
                Download result sheet
              </button>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No published results yet.
          </div>
        )}
      </div>
    </div>
  );
};
