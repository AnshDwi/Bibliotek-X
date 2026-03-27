import { useMemo, useState } from "react";

import { api } from "../../api/http.js";

export const GuardianMeetingsPanel = ({ meetings = [], teacher, reload, userRole = "student" }) => {
  const defaultStudentId = teacher?.students?.[0]?.id || "";
  const [form, setForm] = useState({
    studentId: defaultStudentId,
    guardianName: "",
    guardianEmail: teacher?.students?.[0]?.parentEmail || "",
    meetingDate: "",
    mode: "call",
    status: "scheduled",
    summary: "",
    actionItems: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedStudent = useMemo(
    () => (teacher?.students || []).find((student) => student.id === form.studentId),
    [form.studentId, teacher?.students]
  );

  const submitMeeting = async () => {
    if (!form.studentId || !form.meetingDate) {
      setMessage("Choose a student and meeting date first.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await api.post("/portal/meetings", {
        studentId: form.studentId,
        guardianName: form.guardianName || selectedStudent?.name || "Guardian",
        guardianEmail: form.guardianEmail || selectedStudent?.parentEmail || "",
        meetingDate: form.meetingDate,
        mode: form.mode,
        status: form.status,
        summary: form.summary,
        actionItems: form.actionItems
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      });
      setMessage("Guardian meeting logged successfully.");
      setForm((current) => ({
        ...current,
        meetingDate: "",
        summary: "",
        actionItems: ""
      }));
      reload?.();
    } catch (_error) {
      setMessage("Could not save the guardian meeting right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <p className="text-sm text-muted">Mentor and guardian log</p>
      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
        {userRole === "teacher" ? "Guardian meetings and intervention history" : "Guardian communication record"}
      </h3>

      {userRole === "teacher" ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <select
            value={form.studentId}
            onChange={(event) => {
              const nextStudent = (teacher?.students || []).find((student) => student.id === event.target.value);
              setForm((current) => ({
                ...current,
                studentId: event.target.value,
                guardianEmail: nextStudent?.parentEmail || current.guardianEmail,
                guardianName: current.guardianName
              }));
            }}
            className="premium-input rounded-2xl px-4 py-3"
          >
            {(teacher?.students || []).map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <input
            value={form.guardianName}
            onChange={(event) => setForm((current) => ({ ...current, guardianName: event.target.value }))}
            placeholder="Guardian name"
            className="premium-input rounded-2xl px-4 py-3"
          />
          <input
            value={form.meetingDate}
            onChange={(event) => setForm((current) => ({ ...current, meetingDate: event.target.value }))}
            type="datetime-local"
            className="premium-input rounded-2xl px-4 py-3"
          />
          <input
            value={form.guardianEmail}
            onChange={(event) => setForm((current) => ({ ...current, guardianEmail: event.target.value }))}
            placeholder="Guardian email"
            className="premium-input rounded-2xl px-4 py-3"
          />
          <select
            value={form.mode}
            onChange={(event) => setForm((current) => ({ ...current, mode: event.target.value }))}
            className="premium-input rounded-2xl px-4 py-3"
          >
            <option value="call">Call</option>
            <option value="video">Video</option>
            <option value="in-person">In person</option>
          </select>
          <textarea
            value={form.summary}
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            placeholder="Meeting objective or summary"
            className="premium-input min-h-24 rounded-2xl px-4 py-3 md:col-span-2"
          />
          <input
            value={form.actionItems}
            onChange={(event) => setForm((current) => ({ ...current, actionItems: event.target.value }))}
            placeholder="Action items, separated by commas"
            className="premium-input rounded-2xl px-4 py-3 md:col-span-2"
          />
          <button
            type="button"
            onClick={submitMeeting}
            className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold md:col-span-2"
          >
            {saving ? "Saving..." : "Log guardian meeting"}
          </button>
        </div>
      ) : null}

      {message ? (
        <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
          {message}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {meetings.length ? (
          meetings.map((meeting) => (
            <div key={meeting.id} className="subtle-card rounded-2xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {userRole === "teacher" ? `${meeting.studentName} • ${meeting.guardianName}` : meeting.guardianName}
                  </p>
                  <p className="mt-1 text-sm text-muted">{meeting.guardianEmail}</p>
                </div>
                <div className="text-right text-xs text-muted">
                  <p>{new Date(meeting.meetingDate).toLocaleString("en-IN")}</p>
                  <p className="uppercase tracking-[0.2em]">{meeting.mode}</p>
                  <p>{meeting.status}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[var(--text-primary)]">{meeting.summary || "Summary pending."}</p>
              {meeting.actionItems?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {meeting.actionItems.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-primary)]">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
            No guardian meetings logged yet.
          </div>
        )}
      </div>
    </div>
  );
};
