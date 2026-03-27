import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ExternalLink, GraduationCap, NotebookTabs, Upload, Users } from "lucide-react";

import { api } from "../../api/http.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "materials", label: "Materials" },
  { id: "assignments", label: "Assignments" },
  { id: "attendance", label: "Attendance" }
];

const getMaterialPreview = (item) => {
  if (item.type === "video") {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
  }
  if (item.type === "pdf") {
    return "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80";
};

const resolveResourceUrl = (fileUrl) => {
  if (!fileUrl) {
    return "";
  }
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  return `http://localhost:5000${fileUrl}`;
};

export const CourseDetailsModal = ({ course, onClose }) => {
  const { user } = useAuth();
  const [portalData, setPortalData] = useState({
    content: [],
    assignments: [],
    enrollments: [],
    attendanceRecords: [],
    attendanceSummary: {
      personalAttendanceRate: 0,
      classAttendanceRate: 0,
      sessionsTracked: 0,
      presentSessions: 0,
      lateSessions: 0,
      absentSessions: 0,
      classPresentEntries: 0,
      classLateEntries: 0,
      classAbsentEntries: 0
    }
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [submissionState, setSubmissionState] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState("");

  useEffect(() => {
    if (!course?._id) {
      setPortalData({
        content: [],
        assignments: [],
        enrollments: [],
        attendanceRecords: [],
        attendanceSummary: {
          personalAttendanceRate: 0,
          classAttendanceRate: 0,
          sessionsTracked: 0,
          presentSessions: 0,
          lateSessions: 0,
          absentSessions: 0,
          classPresentEntries: 0,
          classLateEntries: 0,
          classAbsentEntries: 0
        }
      });
      setActiveTab("overview");
      return;
    }

    let mounted = true;

    api
      .get(`/courses/${course._id}/portal`)
      .then((response) => {
        if (mounted) {
          setPortalData({
            content: response.data.content || [],
            assignments: response.data.assignments || [],
            enrollments: response.data.enrollments || [],
            attendanceRecords: response.data.attendanceRecords || [],
            attendanceSummary: response.data.attendanceSummary || {
              personalAttendanceRate: 0,
              classAttendanceRate: 0,
              sessionsTracked: 0,
              presentSessions: 0,
              lateSessions: 0,
              absentSessions: 0,
              classPresentEntries: 0,
              classLateEntries: 0,
              classAbsentEntries: 0
            }
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setPortalData({
            content: [],
            assignments: [],
            enrollments: [],
            attendanceRecords: [],
            attendanceSummary: {
              personalAttendanceRate: 0,
              classAttendanceRate: 0,
              sessionsTracked: 0,
              presentSessions: 0,
              lateSessions: 0,
              absentSessions: 0,
              classPresentEntries: 0,
              classLateEntries: 0,
              classAbsentEntries: 0
            }
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, [course?._id]);

  const attendanceRate = useMemo(() => {
    const total = portalData.attendanceRecords.reduce(
      (sum, record) => sum + record.presentCount + record.lateCount + record.absentCount,
      0
    );
    if (!total) {
      return 0;
    }

    const weighted = portalData.attendanceRecords.reduce(
      (sum, record) => sum + record.presentCount + record.lateCount * 0.5,
      0
    );
    return Math.round((weighted / total) * 100);
  }, [portalData.attendanceRecords]);

  const displayedAttendanceRate =
    user?.role === "teacher"
      ? portalData.attendanceSummary.classAttendanceRate || attendanceRate
      : portalData.attendanceSummary.personalAttendanceRate || course.attendanceRate || attendanceRate;
  const displayedPresentCount =
    user?.role === "teacher"
      ? portalData.attendanceSummary.classPresentEntries
      : portalData.attendanceSummary.presentSessions;
  const displayedLateCount =
    user?.role === "teacher" ? portalData.attendanceSummary.classLateEntries : portalData.attendanceSummary.lateSessions;

  const submitAssignment = async (assignmentId) => {
    const current = submissionState[assignmentId] || { submissionUrl: "", notes: "" };
    if (!current.submissionUrl.trim()) {
      setSubmissionMessage("Add a submission link first.");
      return;
    }

    try {
      const response = await api.post(`/assignments/${assignmentId}/submissions`, current);
      const updatedAssignment = response.data.assignment;
      setPortalData((existing) => ({
        ...existing,
        assignments: existing.assignments.map((assignment) =>
          assignment._id === assignmentId
            ? {
                ...assignment,
                mySubmission:
                  updatedAssignment.submissions?.find((item) => item.submissionUrl === current.submissionUrl) ||
                  {
                    submissionUrl: current.submissionUrl,
                    notes: current.notes,
                    submittedAt: new Date().toISOString()
                  }
              }
            : assignment
        )
      }));
      setSubmissionMessage("Assignment submitted successfully.");
    } catch (_error) {
      setSubmissionMessage("Could not submit the assignment right now.");
    }
  };

  if (!course) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="glass-card max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] p-6">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="h-44 w-full object-cover" />
          ) : (
            <div className="h-44 w-full bg-[linear-gradient(135deg,rgba(59,130,246,0.45),rgba(147,51,234,0.25),rgba(34,211,238,0.25))]" />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{course.category}</p>
            <h3 className="mt-1 text-3xl font-bold text-[var(--text-primary)]">{course.title}</h3>
            <p className="mt-3 max-w-3xl text-sm text-muted">{course.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="subtle-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-cyan-300" />
              <div>
                <p className="text-sm text-muted">Teacher</p>
                <p className="mt-1 font-semibold text-[var(--text-primary)]">{course.teacher?.name || "Assigned faculty"}</p>
              </div>
            </div>
          </div>
          <div className="subtle-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <NotebookTabs className="h-5 w-5 text-fuchsia-300" />
              <div>
                <p className="text-sm text-muted">Modules</p>
                <p className="mt-1 font-semibold text-[var(--text-primary)]">{(course.modules || []).length}</p>
              </div>
            </div>
          </div>
          <div className="subtle-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-sm text-muted">Class strength</p>
                <p className="mt-1 font-semibold text-[var(--text-primary)]">{portalData.enrollments.length}</p>
              </div>
            </div>
          </div>
          <div className="subtle-card rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-sm text-muted">Attendance</p>
                <p className="mt-1 font-semibold text-[var(--text-primary)]">{displayedAttendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-[var(--button-gradient)] text-white shadow-lg"
                  : "border border-white/10 bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {submissionMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {submissionMessage}
          </div>
        ) : null}

        {activeTab === "overview" ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              {(course.modules || []).length ? (
                course.modules.map((module, index) => (
                  <div key={`${module.title}-${index}`} className="subtle-card rounded-2xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Module {index + 1}</p>
                        <p className="mt-1 font-semibold text-[var(--text-primary)]">{module.title}</p>
                        <p className="mt-2 text-sm text-muted">{module.description}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-primary)]">
                        {module.durationMinutes || 0} min
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(module.topics || []).map((topic) => (
                        <span key={topic} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-primary)]">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
                  This course does not have module details yet.
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="subtle-card rounded-2xl p-4">
                <p className="text-sm text-muted">Course progress</p>
                <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{course.progress || 0}%</p>
                <div className="mt-4 h-2 rounded-full bg-black/10">
                  <div className="h-full rounded-full bg-[var(--button-gradient)]" style={{ width: `${course.progress || 0}%` }} />
                </div>
              </div>
              <div className="subtle-card rounded-2xl p-4">
                <p className="text-sm text-muted">Enrolled learners</p>
                <div className="mt-3 space-y-3">
                  {portalData.enrollments.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="font-medium text-[var(--text-primary)]">{item.user?.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        Progress {item.progress}% | {item.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "materials" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {portalData.content.length ? (
              portalData.content.map((item) => (
                <div key={item._id} className="subtle-card overflow-hidden rounded-2xl">
                  <img src={getMaterialPreview(item)} alt={item.title} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                      <span className="text-xs uppercase text-cyan-300">{item.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{item.summary || item.description}</p>
                    {(item.extractedTopics || []).length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.extractedTopics.map((topic) => (
                          <span key={topic} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-primary)]">
                            {topic}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {item.fileUrl ? (
                      <a
                        href={resolveResourceUrl(item.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open resource
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
                No notes or study material uploaded yet.
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "assignments" ? (
          <div className="mt-6 space-y-4">
            {portalData.assignments.length ? (
              portalData.assignments.map((item) => {
                const currentSubmission = submissionState[item._id] || {
                  submissionUrl: item.mySubmission?.submissionUrl || "",
                  notes: item.mySubmission?.notes || ""
                };

                return (
                  <div key={item._id} className="subtle-card rounded-2xl p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
                        <p className="mt-2 text-sm text-muted">{item.description}</p>
                      </div>
                      <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/15 px-3 py-1 text-xs uppercase text-fuchsia-200">
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-muted">
                      Due{" "}
                      {new Date(item.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr,auto]">
                      <input
                        value={currentSubmission.submissionUrl}
                        onChange={(event) =>
                          setSubmissionState((existing) => ({
                            ...existing,
                            [item._id]: {
                              ...currentSubmission,
                              submissionUrl: event.target.value
                            }
                          }))
                        }
                        placeholder="Paste Google Drive, GitHub, or document link"
                        className="premium-input w-full rounded-2xl px-4 py-3"
                      />
                      <button
                        type="button"
                        onClick={() => submitAssignment(item._id)}
                        className="gradient-button inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold"
                      >
                        <Upload className="h-4 w-4" />
                        Upload submission
                      </button>
                    </div>
                    <textarea
                      value={currentSubmission.notes}
                      onChange={(event) =>
                        setSubmissionState((existing) => ({
                          ...existing,
                          [item._id]: {
                            ...currentSubmission,
                            notes: event.target.value
                          }
                        }))
                      }
                      placeholder="Add short notes for your teacher"
                      className="premium-input mt-3 min-h-24 w-full rounded-2xl px-4 py-3"
                    />
                    {item.mySubmission ? (
                      <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        Submitted on{" "}
                        {new Date(item.mySubmission.submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                        {item.mySubmission.score ? ` | Score ${item.mySubmission.score}` : ""}
                      </div>
                    ) : null}
                    {user?.role === "teacher" && item.submissions?.length ? (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Student submissions</p>
                        {item.submissions.map((submission) => (
                          <div key={`${item._id}-${submission.studentId}`} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="font-medium text-[var(--text-primary)]">{submission.studentName}</p>
                                <p className="mt-1 text-xs text-muted">
                                  {submission.submittedAt
                                    ? `Submitted ${new Date(submission.submittedAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                      })}`
                                    : "Submission pending"}
                                </p>
                              </div>
                              <div className="text-right text-xs text-muted">
                                <p>{submission.score ? `Score ${submission.score}` : "Not graded"}</p>
                                <p>{submission.feedback || "Feedback pending"}</p>
                              </div>
                            </div>
                            {submission.submissionUrl ? (
                              <a
                                href={resolveResourceUrl(submission.submissionUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open submission
                              </a>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
                No assignments published for this course yet.
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "attendance" ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="subtle-card rounded-2xl p-4">
                <p className="text-sm text-muted">{user?.role === "teacher" ? "Class attendance" : "My attendance"}</p>
                <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{displayedAttendanceRate}%</p>
              </div>
              <div className="subtle-card rounded-2xl p-4">
                <p className="text-sm text-muted">Sessions tracked</p>
                <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{portalData.attendanceSummary.sessionsTracked}</p>
              </div>
              <div className="subtle-card rounded-2xl p-4">
                <p className="text-sm text-muted">{user?.role === "teacher" ? "Present / Late entries" : "Present / Late"}</p>
                <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
                  {displayedPresentCount}/{displayedLateCount}
                </p>
              </div>
              <div className="subtle-card rounded-2xl p-4">
                <p className="text-sm text-muted">Status</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                  {displayedAttendanceRate >= 75 ? "Eligible" : "Attendance warning"}
                </p>
              </div>
            </div>
            {portalData.attendanceRecords.length ? (
              portalData.attendanceRecords.map((record) => (
                <div key={record.id} className="subtle-card rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-[var(--text-primary)]">
                      {new Date(record.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-emerald-200">
                        Present {record.presentCount}
                      </span>
                      <span className="rounded-full border border-amber-400/20 bg-amber-500/15 px-3 py-1 text-amber-200">
                        Late {record.lateCount}
                      </span>
                      <span className="rounded-full border border-rose-400/20 bg-rose-500/15 px-3 py-1 text-rose-200">
                        Absent {record.absentCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="subtle-card rounded-2xl p-4 text-sm text-muted">
                Attendance has not been marked for this course yet.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
