import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { api } from "../../api/http.js";
import { PageHeader } from "../../components/layout/PageHeader.jsx";

export const DocumentsPage = () => {
  const { documentRequests, reload, user } = useOutletContext();
  const isTeacher = user.role === "teacher";
  const [form, setForm] = useState({ type: "bonafide", purpose: "" });
  const [status, setStatus] = useState("");

  const submitRequest = async (event) => {
    event.preventDefault();
    await api.post("/portal/documents", form);
    setForm({ type: "bonafide", purpose: "" });
    setStatus("Document request submitted.");
    reload?.();
  };

  const reviewRequest = async (id, nextStatus) => {
    await api.patch(`/portal/documents/${id}`, {
      status: nextStatus,
      remarks: nextStatus === "approved" ? "Approved by academic office" : "Please contact admin office"
    });
    reload?.();
  };

  const downloadDocument = async (id) => {
    const response = await api.get(`/portal/documents/${id}/file.pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bibliotek-x-document.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Documents"
        title="Certificates and request workflow"
        description="Request bonafide letters, transcripts, fee receipts, and identity reissues from one place."
        breadcrumbs={["Portal", "Documents"]}
      />

      {!isTeacher ? (
        <form onSubmit={submitRequest} className="glass-card rounded-3xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              className="premium-input rounded-2xl px-4 py-3"
            >
              <option value="bonafide">Bonafide certificate</option>
              <option value="transcript">Transcript</option>
              <option value="id-reissue">ID reissue</option>
              <option value="fee-receipt">Fee receipt</option>
            </select>
            <input
              value={form.purpose}
              onChange={(event) => setForm((current) => ({ ...current, purpose: event.target.value }))}
              className="premium-input rounded-2xl px-4 py-3"
              placeholder="Purpose for the request"
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
              Submit request
            </button>
            {status ? <p className="text-sm text-emerald-300">{status}</p> : null}
          </div>
        </form>
      ) : null}

      <div className="grid gap-4">
        {documentRequests.length ? (
          documentRequests.map((request) => (
            <div key={request.id} className="glass-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">{request.type}</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                    {isTeacher ? `${request.userName} | ${request.rollNumber}` : request.purpose}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {isTeacher ? `${request.program || request.department} | ${request.academicYear}` : request.purpose}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  {request.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted">
                Requested on {new Date(request.createdAt).toLocaleDateString("en-IN")}
                {request.approvedAt ? ` | Processed on ${new Date(request.approvedAt).toLocaleDateString("en-IN")}` : ""}
              </p>
              {request.remarks ? <p className="mt-2 text-sm text-[var(--text-primary)]">{request.remarks}</p> : null}
              <div className="mt-4 flex flex-wrap gap-3">
                {request.status === "approved" ? (
                  <button
                    type="button"
                    onClick={() => downloadDocument(request.id)}
                    className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold"
                  >
                    Download PDF
                  </button>
                ) : null}
                {isTeacher ? (
                  <>
                    <button
                      type="button"
                      onClick={() => reviewRequest(request.id, "approved")}
                      className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => reviewRequest(request.id, "rejected")}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--text-primary)]"
                    >
                      Reject
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-6 text-sm text-muted">
            No document requests yet.
          </div>
        )}
      </div>
    </div>
  );
};
