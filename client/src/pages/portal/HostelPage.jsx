import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useOutletContext } from "react-router-dom";

export const HostelPage = () => {
  const { hostelPasses, user } = useOutletContext();
  const isTeacher = user.role === "teacher";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Hostel"
        title="Hostel pass and residency details"
        description="Track residency status, room allocations, and hostel validation details."
        breadcrumbs={["Portal", "Hostel"]}
      />
      <div className="grid gap-4">
        {hostelPasses.length ? (
          hostelPasses.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{item.hostelName}</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                    {isTeacher ? `${item.userName} • ${item.rollNumber}` : `Room ${item.roomNumber}`}
                  </h3>
                  <p className="mt-2 text-sm text-muted">Warden: {item.wardenName || "Assigned"}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted">
                Valid until {new Date(item.validUntil).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No hostel records are available right now.
          </div>
        )}
      </div>
    </div>
  );
};
