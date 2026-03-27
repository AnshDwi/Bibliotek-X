import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { api } from "../../api/http.js";
import { PageHeader } from "../../components/layout/PageHeader.jsx";

export const FeesPage = () => {
  const { fees, reload, user } = useOutletContext();
  const [status, setStatus] = useState("");
  const isTeacher = user.role === "teacher";

  const payNow = async (feeId) => {
    await api.post(`/portal/fees/${feeId}/pay`);
    setStatus("Fee payment marked successfully. Refresh the page to see the updated status.");
    reload();
  };

  const downloadReceipt = async (feeId) => {
    const response = await api.get(`/portal/fees/${feeId}/receipt.pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bibliotek-x-fee-receipt.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fees"
        title={isTeacher ? "Fee status overview" : "Fee records and payment status"}
        description="Review fee breakdowns, due dates, and payment completion status across academic terms."
        breadcrumbs={["Portal", "Fees"]}
      />
      {status ? <div className="glass-card rounded-3xl p-4 text-sm text-emerald-300">{status}</div> : null}
      <div className="grid gap-6 md:grid-cols-2">
        {fees.length ? (
          fees.map((fee) => (
            <div key={fee.id} className="glass-card rounded-3xl p-6">
              <p className="text-sm text-muted">{isTeacher ? fee.userName : "Student account"}</p>
              <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{fee.term}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">Total: Rs. {fee.totalAmount}</div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">Paid: Rs. {fee.paidAmount}</div>
                <div className="subtle-card rounded-2xl p-4 text-sm text-[var(--text-primary)]">Status: {fee.status}</div>
              </div>
              <div className="mt-4 space-y-2">
                {(fee.items || []).map((item) => (
                  <div key={`${fee.id}-${item.label}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-primary)]">
                    {item.label}: Rs. {item.amount}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Due {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {!isTeacher && fee.status !== "paid" ? (
                  <button type="button" onClick={() => payNow(fee.id)} className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
                    Mark as paid
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => downloadReceipt(fee.id)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                >
                  Download receipt
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No fee records available.
          </div>
        )}
      </div>
    </div>
  );
};
