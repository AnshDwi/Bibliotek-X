import { SectionHeader } from "../../components/common/SectionHeader.jsx";

export const AdminDashboard = () => (
  <div className="glass rounded-3xl p-6">
    <SectionHeader
      eyebrow="Admin Control"
      title="Security, audit trail, adoption, and platform intelligence"
      description="Administrators oversee access control, audit logs, engagement metrics, notification systems, and deployment health."
    />
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">Users</p>
        <p className="mt-2 text-3xl font-semibold text-white">4,892</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">Security events</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-300">0 critical</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">Retention uplift</p>
        <p className="mt-2 text-3xl font-semibold text-sky-300">+22%</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-sm text-slate-400">Audit trail</p>
        <p className="mt-2 text-3xl font-semibold text-white">Live</p>
      </div>
    </div>
  </div>
);

