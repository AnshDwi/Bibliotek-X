import { CalendarCheck2, FilePlus2, MessageSquareShare, NotebookPen, RadioTower } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../../api/http.js";

const actions = [
  {
    icon: NotebookPen,
    title: "Upload notes",
    description: "Upload PDFs, videos, links, and trigger AI summaries."
  },
  {
    icon: CalendarCheck2,
    title: "Mark attendance",
    description: "Track present, absent, and late students in bulk."
  },
  {
    icon: FilePlus2,
    title: "Create assignments",
    description: "Publish assignments and auto-graded quizzes."
  },
  {
    icon: MessageSquareShare,
    title: "Message parents",
    description: "Send weekly reports, alerts, and performance summaries."
  },
  {
    icon: RadioTower,
    title: "Start live class",
    description: "Launch a live session with notes and transcript capture."
  }
];

const createEmptyModule = () => ({
  title: "",
  description: "",
  durationMinutes: 60,
  topics: ""
});

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const TeacherOperationsPanel = ({ teacher, onReload }) => {
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Intermediate",
    tags: "",
    modules: [createEmptyModule()]
  });
  const [attendanceForm, setAttendanceForm] = useState({
    courseId: teacher?.courses?.[0]?._id || "",
    date: new Date().toISOString().slice(0, 10),
    entries: {}
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: teacher?.courses?.[0]?._id || "",
    title: "",
    type: "assignment",
    description: "",
    dueDate: "",
    questionsCount: 5
  });
  const [noteForm, setNoteForm] = useState({
    courseId: teacher?.courses?.[0]?._id || "",
    title: "",
    type: "note",
    description: "",
    textContent: "",
    fileUrl: ""
  });
  const [messageForm, setMessageForm] = useState({
    studentId: teacher?.students?.[0]?.id || "",
    parentEmail: "",
    subject: "",
    body: "",
    type: "weekly-report"
  });
  const [liveForm, setLiveForm] = useState({
    courseId: teacher?.courses?.[0]?._id || "",
    title: "",
    status: "live",
    attendees: 0
  });

  useEffect(() => {
    setAttendanceForm((current) => ({
      ...current,
      courseId: current.courseId || teacher?.courses?.[0]?._id || ""
    }));
    setAssignmentForm((current) => ({
      ...current,
      courseId: current.courseId || teacher?.courses?.[0]?._id || ""
    }));
    setNoteForm((current) => ({
      ...current,
      courseId: current.courseId || teacher?.courses?.[0]?._id || ""
    }));
    setMessageForm((current) => ({
      ...current,
      studentId: current.studentId || teacher?.students?.[0]?.id || "",
      parentEmail: current.parentEmail || teacher?.students?.[0]?.parentEmail || ""
    }));
    setLiveForm((current) => ({
      ...current,
      courseId: current.courseId || teacher?.courses?.[0]?._id || ""
    }));
  }, [teacher]);

  const applyBulkAttendance = (status) => {
    const nextEntries = {};
    (teacher?.students || []).forEach((student) => {
      nextEntries[student.id] = status;
    });
    setAttendanceForm((current) => ({
      ...current,
      entries: nextEntries
    }));
  };

  const updateModule = (index, field, value) => {
    setCourseForm((current) => ({
      ...current,
      modules: current.modules.map((module, moduleIndex) =>
        moduleIndex === index ? { ...module, [field]: value } : module
      )
    }));
  };

  const addModule = () => {
    setCourseForm((current) => ({
      ...current,
      modules: [...current.modules, createEmptyModule()]
    }));
  };

  const removeModule = (index) => {
    setCourseForm((current) => ({
      ...current,
      modules: current.modules.filter((_, moduleIndex) => moduleIndex !== index)
    }));
  };

  const submitCourse = async (event) => {
    event.preventDefault();
    const payload = {
      title: courseForm.title,
      slug: slugify(courseForm.title),
      description: courseForm.description,
      category: courseForm.category,
      level: courseForm.level,
      tags: courseForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      modules: courseForm.modules
        .filter((module) => module.title.trim())
        .map((module) => ({
          title: module.title.trim(),
          description: module.description.trim(),
          durationMinutes: Number(module.durationMinutes) || 0,
          topics: module.topics
            .split(",")
            .map((topic) => topic.trim())
            .filter(Boolean)
        }))
    };

    await api.post("/courses", payload);
    setCourseForm({
      title: "",
      description: "",
      category: "",
      level: "Intermediate",
      tags: "",
      modules: [createEmptyModule()]
    });
    setStatusMessage("Course created successfully.");
    onReload();
  };

  const submitAttendance = async (event) => {
    event.preventDefault();
    const entries = (teacher?.students || []).map((student) => ({
      student: student.id,
      status: attendanceForm.entries[student.id] || "present"
    }));

    await api.post("/teacher/attendance", {
      courseId: attendanceForm.courseId || teacher?.courses?.[0]?._id,
      date: attendanceForm.date,
      entries
    });
    setStatusMessage("Attendance marked successfully.");
    onReload();
  };

  const submitAssignment = async (event) => {
    event.preventDefault();
    await api.post("/teacher/assignments", {
      ...assignmentForm,
      dueDate: new Date(assignmentForm.dueDate).toISOString(),
      maxScore: 100
    });
    setAssignmentForm((current) => ({
      ...current,
      title: "",
      description: "",
      dueDate: "",
      questionsCount: 5
    }));
    setStatusMessage("Assignment created successfully.");
    onReload();
  };

  const submitNote = async (event) => {
    event.preventDefault();
    await api.post(`/content/${noteForm.courseId}`, {
      title: noteForm.title,
      type: noteForm.type,
      description: noteForm.description,
      textContent: noteForm.textContent,
      fileUrl: noteForm.fileUrl
    });
    setNoteForm((current) => ({
      ...current,
      title: "",
      description: "",
      textContent: "",
      fileUrl: ""
    }));
    setStatusMessage("Notes/content uploaded successfully.");
    onReload();
  };

  const jumpToForm = (formId) => {
    const element = document.getElementById(formId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const submitParentMessage = async (event) => {
    event.preventDefault();
    await api.post("/teacher/parent-messages", {
      student: messageForm.studentId,
      studentId: messageForm.studentId,
      parentEmail: messageForm.parentEmail,
      subject: messageForm.subject,
      body: messageForm.body,
      type: messageForm.type
    });
    setMessageForm((current) => ({
      ...current,
      subject: "",
      body: ""
    }));
    setStatusMessage("Parent message sent successfully.");
    onReload();
  };

  const submitLiveSession = async (event) => {
    event.preventDefault();
    await api.post("/teacher/live-sessions", liveForm);
    setLiveForm((current) => ({
      ...current,
      title: "",
      attendees: 0
    }));
    setStatusMessage("Live class started successfully.");
    onReload();
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Teacher controls</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">Run your class from one faculty workspace</h3>
          <p className="mt-2 text-sm text-muted">
            Create courses, mark attendance, publish notes, and reach parents the way an actual college portal works.
          </p>
        </div>
        {statusMessage ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{statusMessage}</p> : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              type="button"
              onClick={() =>
                jumpToForm(
                  action.title === "Upload notes"
                    ? "teacher-notes-form"
                    : action.title === "Mark attendance"
                      ? "teacher-attendance-form"
                      : action.title === "Create assignments"
                        ? "teacher-assignment-form"
                        : action.title === "Message parents"
                          ? "teacher-parent-form"
                          : "teacher-live-class"
                )
              }
              className="subtle-card hover-lift rounded-3xl p-4 text-left"
            >
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="mt-4 font-semibold text-[var(--text-primary)]">{action.title}</h4>
              <p className="mt-2 text-sm text-muted">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <form id="teacher-course-form" onSubmit={submitCourse} className="subtle-card rounded-3xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">Add a course</h4>
            <button type="button" onClick={addModule} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-primary)]">
              Add module
            </button>
          </div>
          <div className="mt-4 space-y-3">
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Course title" value={courseForm.title} onChange={(event) => setCourseForm((current) => ({ ...current, title: event.target.value }))} />
            <textarea className="premium-input min-h-28 w-full rounded-2xl px-4 py-3" placeholder="Course description" value={courseForm.description} onChange={(event) => setCourseForm((current) => ({ ...current, description: event.target.value }))} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Category" value={courseForm.category} onChange={(event) => setCourseForm((current) => ({ ...current, category: event.target.value }))} />
              <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Level" value={courseForm.level} onChange={(event) => setCourseForm((current) => ({ ...current, level: event.target.value }))} />
            </div>
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Tags (comma separated)" value={courseForm.tags} onChange={(event) => setCourseForm((current) => ({ ...current, tags: event.target.value }))} />
            <div className="space-y-3">
              {courseForm.modules.map((module, index) => (
                <div key={`module-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--text-primary)]">Module {index + 1}</p>
                    {courseForm.modules.length > 1 ? (
                      <button type="button" onClick={() => removeModule(index)} className="text-sm text-rose-300">
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 space-y-3">
                    <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Module title" value={module.title} onChange={(event) => updateModule(index, "title", event.target.value)} />
                    <textarea className="premium-input min-h-20 w-full rounded-2xl px-4 py-3" placeholder="Module description" value={module.description} onChange={(event) => updateModule(index, "description", event.target.value)} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input type="number" min="0" className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Duration in minutes" value={module.durationMinutes} onChange={(event) => updateModule(index, "durationMinutes", event.target.value)} />
                      <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Topics (comma separated)" value={module.topics} onChange={(event) => updateModule(index, "topics", event.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
              Create course
            </button>
          </div>
        </form>

        <form id="teacher-attendance-form" onSubmit={submitAttendance} className="subtle-card rounded-3xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">Mark attendance</h4>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => applyBulkAttendance("present")} className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                All present
              </button>
              <button type="button" onClick={() => applyBulkAttendance("late")} className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                All late
              </button>
              <button type="button" onClick={() => applyBulkAttendance("absent")} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                All absent
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <select className="premium-input w-full rounded-2xl px-4 py-3" value={attendanceForm.courseId} onChange={(event) => setAttendanceForm((current) => ({ ...current, courseId: event.target.value }))}>
              {(teacher?.courses || []).map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input type="date" className="premium-input w-full rounded-2xl px-4 py-3" value={attendanceForm.date} onChange={(event) => setAttendanceForm((current) => ({ ...current, date: event.target.value }))} />
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {(teacher?.students || []).map((student) => (
                <div key={student.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{student.name}</p>
                      <p className="mt-1 text-xs text-muted">Current attendance {student.attendanceRate}%</p>
                    </div>
                    <select
                      className="premium-input rounded-2xl px-3 py-2"
                      value={attendanceForm.entries[student.id] || "present"}
                      onChange={(event) =>
                        setAttendanceForm((current) => ({
                          ...current,
                          entries: {
                            ...current.entries,
                            [student.id]: event.target.value
                          }
                        }))
                      }
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">
              Save attendance
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <form id="teacher-assignment-form" onSubmit={submitAssignment} className="subtle-card rounded-3xl p-5">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">Create assignment</h4>
          <div className="mt-4 space-y-3">
            <select className="premium-input w-full rounded-2xl px-4 py-3" value={assignmentForm.courseId} onChange={(event) => setAssignmentForm((current) => ({ ...current, courseId: event.target.value }))}>
              {(teacher?.courses || []).map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Assignment title" value={assignmentForm.title} onChange={(event) => setAssignmentForm((current) => ({ ...current, title: event.target.value }))} />
            <select className="premium-input w-full rounded-2xl px-4 py-3" value={assignmentForm.type} onChange={(event) => setAssignmentForm((current) => ({ ...current, type: event.target.value }))}>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
            </select>
            <textarea className="premium-input min-h-24 w-full rounded-2xl px-4 py-3" placeholder="Assignment description" value={assignmentForm.description} onChange={(event) => setAssignmentForm((current) => ({ ...current, description: event.target.value }))} />
            <input type="date" className="premium-input w-full rounded-2xl px-4 py-3" value={assignmentForm.dueDate} onChange={(event) => setAssignmentForm((current) => ({ ...current, dueDate: event.target.value }))} />
            <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">Publish assignment</button>
          </div>
        </form>

        <form id="teacher-notes-form" onSubmit={submitNote} className="subtle-card rounded-3xl p-5">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">Upload notes</h4>
          <div className="mt-4 space-y-3">
            <select className="premium-input w-full rounded-2xl px-4 py-3" value={noteForm.courseId} onChange={(event) => setNoteForm((current) => ({ ...current, courseId: event.target.value }))}>
              {(teacher?.courses || []).map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Note title" value={noteForm.title} onChange={(event) => setNoteForm((current) => ({ ...current, title: event.target.value }))} />
            <select className="premium-input w-full rounded-2xl px-4 py-3" value={noteForm.type} onChange={(event) => setNoteForm((current) => ({ ...current, type: event.target.value }))}>
              <option value="note">Note</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
            </select>
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Short description" value={noteForm.description} onChange={(event) => setNoteForm((current) => ({ ...current, description: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Resource link (YouTube, PDF, Drive link)" value={noteForm.fileUrl} onChange={(event) => setNoteForm((current) => ({ ...current, fileUrl: event.target.value }))} />
            <textarea className="premium-input min-h-28 w-full rounded-2xl px-4 py-3" placeholder="Paste notes or content text" value={noteForm.textContent} onChange={(event) => setNoteForm((current) => ({ ...current, textContent: event.target.value }))} />
            <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">Save notes</button>
          </div>
        </form>

        <form id="teacher-parent-form" onSubmit={submitParentMessage} className="subtle-card rounded-3xl p-5">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">Message parents</h4>
          <div className="mt-4 space-y-3">
            <select
              className="premium-input w-full rounded-2xl px-4 py-3"
              value={messageForm.studentId}
              onChange={(event) => {
                const selected = (teacher?.students || []).find((student) => student.id === event.target.value);
                setMessageForm((current) => ({
                  ...current,
                  studentId: event.target.value,
                  parentEmail: selected?.parentEmail || current.parentEmail
                }));
              }}
            >
              {(teacher?.students || []).map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Parent email" value={messageForm.parentEmail} onChange={(event) => setMessageForm((current) => ({ ...current, parentEmail: event.target.value }))} />
            <input className="premium-input w-full rounded-2xl px-4 py-3" placeholder="Subject" value={messageForm.subject} onChange={(event) => setMessageForm((current) => ({ ...current, subject: event.target.value }))} />
            <textarea className="premium-input min-h-28 w-full rounded-2xl px-4 py-3" placeholder="Message body" value={messageForm.body} onChange={(event) => setMessageForm((current) => ({ ...current, body: event.target.value }))} />
            <button type="submit" className="gradient-button rounded-2xl px-4 py-3 text-sm font-semibold">Send message</button>
          </div>
        </form>
      </div>

      <form id="teacher-live-class" onSubmit={submitLiveSession} className="subtle-card mt-6 rounded-3xl p-5">
        <h4 className="text-lg font-semibold text-[var(--text-primary)]">Live class</h4>
        <p className="mt-2 text-sm text-muted">
          Launch a session, record the topic, and generate transcript-ready notes through the existing backend.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select className="premium-input rounded-2xl px-4 py-3" value={liveForm.courseId} onChange={(event) => setLiveForm((current) => ({ ...current, courseId: event.target.value }))}>
            {(teacher?.courses || []).map((course) => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
          <input className="premium-input rounded-2xl px-4 py-3 md:col-span-2" placeholder="Session title" value={liveForm.title} onChange={(event) => setLiveForm((current) => ({ ...current, title: event.target.value }))} />
          <input type="number" min="0" className="premium-input rounded-2xl px-4 py-3" placeholder="Attendees" value={liveForm.attendees} onChange={(event) => setLiveForm((current) => ({ ...current, attendees: Number(event.target.value) }))} />
        </div>
        <button type="submit" className="gradient-button mt-4 rounded-2xl px-4 py-3 text-sm font-semibold">
          Start live class
        </button>
      </form>
    </div>
  );
};
