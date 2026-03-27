import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useOutletContext } from "react-router-dom";

export const InternshipsPage = () => {
  const { internships, user } = useOutletContext();
  const isTeacher = user.role === "teacher";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Internships"
        title="Internship and training tracker"
        description="Review applied, active, and completed internships across the academic cycle."
        breadcrumbs={["Portal", "Internships"]}
      />
      <div className="grid gap-4">
        {internships.length ? (
          internships.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{item.companyName}</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                    {isTeacher ? `${item.userName} | ${item.rollNumber}` : item.domain}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {isTeacher ? item.program : `${item.duration} | Mentor ${item.mentorName}`}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No internship records available yet.
          </div>
        )}
      </div>
    </div>
  );
};
