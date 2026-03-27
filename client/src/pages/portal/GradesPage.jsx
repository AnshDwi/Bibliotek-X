import { useOutletContext } from "react-router-dom";

import { PageHeader } from "../../components/layout/PageHeader.jsx";

export const GradesPage = () => {
  const { grades } = useOutletContext();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Grades"
        title="Assignment scores and submission status"
        description="Track submitted work, feedback, and scored assessments across all enrolled courses."
        breadcrumbs={["Portal", "Grades"]}
      />
      <div className="glass-card rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[var(--text-secondary)]">
              <tr>
                <th className="pb-3 pr-4">Course</th>
                <th className="pb-3 pr-4">Assessment</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Due Date</th>
                <th className="pb-3 pr-4">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {grades.length ? (
                grades.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="py-4 pr-4 text-[var(--text-primary)]">{item.courseTitle}</td>
                    <td className="py-4 pr-4 text-[var(--text-primary)]">{item.title}</td>
                    <td className="py-4 pr-4 text-muted">
                      <div>{item.status}</div>
                      <div className="text-xs">{item.semester} | {item.courseCredits} credits</div>
                    </td>
                    <td className="py-4 pr-4 text-muted">
                      {item.score === null ? "-" : `${item.score}/${item.maxScore}`}
                    </td>
                    <td className="py-4 pr-4 text-muted">
                      {new Date(item.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 pr-4 text-muted">{item.feedback || "Pending review"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-muted">
                    Grades will appear here once assignments and quizzes are graded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
