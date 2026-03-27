import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { useOutletContext } from "react-router-dom";

export const AdminQueuePage = () => {
  const { documentRequests, leaves, meetings } = useOutletContext();
  const pendingDocuments = documentRequests.filter((item) => item.status === "submitted" || item.status === "under-review");
  const pendingLeaves = leaves.filter((item) => item.status === "pending");
  const scheduledMeetings = meetings.filter((item) => item.status === "scheduled");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Queue"
        title="Operations and approvals queue"
        description="A single queue for pending academic-office tasks, approvals, and follow-up actions."
        breadcrumbs={["Portal", "Admin Queue"]}
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Document approvals</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{pendingDocuments.length} pending</h3>
          <div className="mt-4 space-y-3">
            {pendingDocuments.slice(0, 4).map((item) => (
              <div key={item.id} className="subtle-card rounded-2xl p-4">
                <p className="font-medium text-[var(--text-primary)]">{item.userName}</p>
                <p className="mt-1 text-sm text-muted">{item.type} | {item.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Leave review</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{pendingLeaves.length} pending</h3>
          <div className="mt-4 space-y-3">
            {pendingLeaves.slice(0, 4).map((item) => (
              <div key={item.id} className="subtle-card rounded-2xl p-4">
                <p className="font-medium text-[var(--text-primary)]">{item.userName}</p>
                <p className="mt-1 text-sm text-muted">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-muted">Guardian follow-up</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{scheduledMeetings.length} scheduled</h3>
          <div className="mt-4 space-y-3">
            {scheduledMeetings.slice(0, 4).map((item) => (
              <div key={item.id} className="subtle-card rounded-2xl p-4">
                <p className="font-medium text-[var(--text-primary)]">{item.guardianName}</p>
                <p className="mt-1 text-sm text-muted">{new Date(item.meetingDate).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
