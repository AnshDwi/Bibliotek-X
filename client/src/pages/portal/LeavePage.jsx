import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { api } from "../../api/http.js";
import { PageHeader } from "../../components/layout/PageHeader.jsx";

export const LeavePage = () => {
  const { leaves, reload, user } = useOutletContext();
  const [form, setForm] = useState({
    title: "",
    reason: "",
    fromDate: "",
    toDate: ""
  });
  const [status, setStatus] = useState("");
  const isTeacher = user.role === "teacher";

  const submitLeave = async (event) => {
    event.preventDefault();
    await api.post("/portal/leaves", form);
    setForm({ title: "", reason: "", fromDate: "", toDate: "" });
    setStatus("Leave application submitted.");
    reload();
  };

  const reviewLeave = async (id, nextStatus) => {
    await api.patch(`/portal/leaves/${id}`, {
      status: nextStatus,
      reviewNote: nextStatus === "approved" ? "Approved by faculty." : "Rejected by faculty."
    });
    setStatus(`Leave ${nextStatus}.`);
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Leave Management"
        title={isTeacher ? "Review student leave requests" : "Apply for academic leave"}
        description="Submit leave requests as a student or review and approve them as faculty through the same portal workflow."
        breadcrumbs={["Portal", "Leave"]}
      />
      {status ? <div className="glass-card rounded-3xl p-4 text-sm text-emerald-300">{status}</div> : null}

      {!isTeacher ? (
        <form onSubmit={submitLeave} className="glass-card rounded-3xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="premium-input rounded-2xl px-4 py-3" placeholder="Leave title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            <input type="date" className="premium-input rounded-2xl px-4 py-3" value={form.fromDate} onChange={(event) => setForm((current) => ({ ...current, fromDate: event.target.value }))} />
            <input type="date" className="premium-input rounded-2xl px-4 py-3" value={form.toDate} onChange={(event) => setForm((current) => ({ ...current, toDate: event.target.value }))} />
            <textarea className="premium-input min-h-28 rounded-2xl px-4 py-3 md:col-span-2" placeholder="Reason for leave" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} />
          </div>
          <button type="submit" className="gradient-button mt-5 rounded-2xl px-4 py-3 text-sm font-semibold">
            Submit leave request
          </button>
        </form>
      ) : null}

      <div className="space-y-4">
        {leaves.length ? (
          leaves.map((item) => (
            <div key={item.id} className="glass-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{item.userName}</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.reason}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase text-cyan-200">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">
                {new Date(item.fromDate).toLocaleDateString("en-IN")} to {new Date(item.toDate).toLocaleDateString("en-IN")}
              </p>
              {item.reviewNote ? <p className="mt-2 text-sm text-[var(--text-primary)]">{item.reviewNote}</p> : null}
              {isTeacher && item.status === "pending" ? (
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={() => reviewLeave(item.id, "approved")} className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
                    Approve
                  </button>
                  <button type="button" onClick={() => reviewLeave(item.id, "rejected")} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No leave applications yet.
          </div>
        )}
      </div>
    </div>
  );
};
