import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useOutletContext } from "react-router-dom";

export const LibraryPage = () => {
  const { libraryRecords, user } = useOutletContext();
  const isTeacher = user.role === "teacher";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Library issue and due tracker"
        description="Track issued books, due dates, overdue items, and fines from one portal page."
        breadcrumbs={["Portal", "Library"]}
      />
      <div className="grid gap-4">
        {libraryRecords.length ? (
          libraryRecords.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{item.accessionCode}</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                    {isTeacher ? `${item.userName} | ${item.rollNumber}` : item.bookTitle}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {isTeacher ? item.bookTitle : `Fine: Rs. ${item.fineAmount}`}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted">
                Issued {new Date(item.issueDate).toLocaleDateString("en-IN")} | Due {new Date(item.dueDate).toLocaleDateString("en-IN")}
              </p>
              {item.returnDate ? (
                <p className="mt-2 text-sm text-muted">
                  Returned on {new Date(item.returnDate).toLocaleDateString("en-IN")}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No library records available yet.
          </div>
        )}
      </div>
    </div>
  );
};
