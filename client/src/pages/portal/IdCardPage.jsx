import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useOutletContext } from "react-router-dom";

export const IdCardPage = () => {
  const { user } = useOutletContext();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Digital ID"
        title="Campus ID card"
        description="Use your digital student or faculty identity card for quick campus verification and admin workflows."
        breadcrumbs={["Portal", "ID Card"]}
      />
      <div className="mx-auto max-w-3xl">
        <div className="glass-card relative overflow-hidden rounded-[2rem] p-8">
          <div className="blob left-[-20px] top-[-20px] h-32 w-32 bg-sky-400/20" />
          <div className="blob bottom-[-10px] right-[-10px] h-32 w-32 bg-fuchsia-400/20" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-cyan-200">
                    {user.name?.[0] || "B"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Bibliotek X Campus Identity</p>
                <h3 className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{user.name}</h3>
                <p className="mt-2 text-sm text-muted">{user.program || user.role}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Role</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{user.role}</p>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-2">
            <div className="subtle-card rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Roll number</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{user.rollNumber || "Not assigned"}</p>
            </div>
            <div className="subtle-card rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Department</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{user.department || "Not updated"}</p>
            </div>
            <div className="subtle-card rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Program</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{user.program || "Not updated"}</p>
            </div>
            <div className="subtle-card rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Academic year</p>
              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{user.academicYear || "Not updated"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
