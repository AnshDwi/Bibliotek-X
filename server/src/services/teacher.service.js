import { Assignment } from "../models/Assignment.js";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { Content } from "../models/Content.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { FocusSession } from "../models/FocusSession.js";
import { LiveSession } from "../models/LiveSession.js";
import { ParentMessage } from "../models/ParentMessage.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { User } from "../models/User.js";
import { buildLearningTwin } from "./analytics/digital-twin.service.js";
import { summarizeContent } from "./ai/content-intelligence.service.js";

const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const getTeacherDashboardData = async (teacherId) => {
  const courses = await Course.find({ teacher: teacherId }).lean();
  const courseIds = courses.map((course) => course._id);

  const [
    enrollments,
    attendanceRecords,
    contents,
    assignments,
    parentMessages,
    liveSessions,
    quizAttempts,
    focusSessions
  ] = await Promise.all([
    Enrollment.find({ course: { $in: courseIds } }).populate("user").populate("course"),
    AttendanceRecord.find({ course: { $in: courseIds } }).populate("course").populate("entries.student"),
    Content.find({ course: { $in: courseIds } }).sort({ createdAt: -1 }).limit(8),
    Assignment.find({ course: { $in: courseIds } })
      .populate("course")
      .populate("submissions.student", "name email")
      .sort({ dueDate: 1 })
      .limit(10),
    ParentMessage.find({ teacher: teacherId }).populate("student", "name parentContact").sort({ createdAt: -1 }).limit(10),
    LiveSession.find({ teacher: teacherId }).populate("course").sort({ startedAt: -1 }).limit(10),
    QuizAttempt.find({ course: { $in: courseIds } }).populate("user", "name"),
    FocusSession.find({ course: { $in: courseIds } }).populate("user", "name")
  ]);

  const attendanceEntries = attendanceRecords.flatMap((record) => record.entries);
  const presentCount = attendanceEntries.filter((entry) => entry.status === "present").length;
  const lateCount = attendanceEntries.filter((entry) => entry.status === "late").length;
  const absentCount = attendanceEntries.filter((entry) => entry.status === "absent").length;
  const attendanceRate = attendanceEntries.length
    ? Math.round(((presentCount + lateCount * 0.5) / attendanceEntries.length) * 100)
    : 0;

  const studentIds = [...new Set(enrollments.map((enrollment) => String(enrollment.user?._id)).filter(Boolean))];
  const students = await User.find({ _id: { $in: studentIds } });
  const studentTwins = await Promise.all(students.map((student) => buildLearningTwin(student._id)));
  const studentTwinMap = new Map(students.map((student, index) => [String(student._id), studentTwinMapFormatter(student, studentTwins[index])]));

  const weakTopicCounter = {};
  students.forEach((student) => {
    const twin = studentTwinMap.get(String(student._id));
    (twin?.weakAreas || []).forEach((topic) => {
      weakTopicCounter[topic] = (weakTopicCounter[topic] || 0) + 1;
    });
  });

  const studentRows = students.map((student) => {
    const twin = studentTwinMap.get(String(student._id));
    const attemptScores = quizAttempts.filter((attempt) => String(attempt.user?._id) === String(student._id)).map((attempt) => attempt.score);
    const focusScores = focusSessions.filter((session) => String(session.user?._id) === String(student._id)).map((session) => session.focusScore);
    const attendanceForStudent = attendanceEntries.filter((entry) => String(entry.student?._id) === String(student._id));
    const attendanceScore = attendanceForStudent.length
      ? Math.round(((attendanceForStudent.filter((entry) => entry.status === "present").length + attendanceForStudent.filter((entry) => entry.status === "late").length * 0.5) / attendanceForStudent.length) * 100)
      : 0;

    return {
      id: student._id,
      name: student.name,
      email: student.email,
      parentEmail: student.parentContact?.email || "",
      xp: student.xp,
      attendanceRate: attendanceScore,
      averageScore: Math.round(average(attemptScores)),
      focusScore: Math.round(average(focusScores)),
      dropoutRisk: twin?.dropoutRisk || "low",
      weakAreas: twin?.weakAreas || [],
      learningSpeed: twin?.learningSpeed || 1,
      nextBestTopics: twin?.nextBestTopics || [],
      engagementScore: Math.round(
        attendanceScore * 0.35 + average(attemptScores) * 0.35 + average(focusScores) * 0.3
      )
    };
  });

  const engagementScore = Math.round(average(studentRows.map((student) => student.engagementScore)));
  const lowAttendanceAlerts = studentRows.filter((student) => student.attendanceRate < 75);
  const riskAlerts = studentRows.filter((student) => student.dropoutRisk !== "low" || student.averageScore < 60);

  return {
    overview: {
      courses: courses.length,
      students: studentRows.length,
      attendanceRate,
      engagementScore,
      dropoutRiskCount: riskAlerts.length
    },
    courses: courses.map((course) => ({
      ...course,
      progress: Math.round(
        average(
          enrollments
            .filter((enrollment) => String(enrollment.course?._id) === String(course._id))
            .map((enrollment) => enrollment.progress || 0)
        )
      )
    })),
    graph: courses[0]?.knowledgeGraph || { nodes: [], edges: [] },
    attendance: {
      presentCount,
      lateCount,
      absentCount,
      lowAttendanceAlerts: lowAttendanceAlerts.slice(0, 6),
      recentRegisters: attendanceRecords
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8)
        .map((record) => ({
          id: record._id,
          courseTitle: record.course?.title || "Course",
          date: record.date,
          presentCount: record.entries.filter((entry) => entry.status === "present").length,
          lateCount: record.entries.filter((entry) => entry.status === "late").length,
          absentCount: record.entries.filter((entry) => entry.status === "absent").length
        }))
    },
    content: contents.map((item) => ({
      id: item._id,
      title: item.title,
      type: item.type,
      summary: item.summary,
      extractedTopics: item.extractedTopics,
      createdAt: item.createdAt
    })),
    parentMessages: parentMessages.map((message) => ({
      id: message._id,
      studentName: message.student?.name || "Student",
      parentEmail: message.parentEmail,
      subject: message.subject,
      type: message.type,
      status: message.status,
      createdAt: message.createdAt
    })),
    classHealth: {
      weakTopics: Object.entries(weakTopicCounter)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([topic, count]) => ({ topic, count })),
      topPerformers: [...studentRows].sort((a, b) => b.averageScore - a.averageScore).slice(0, 5),
      strugglingStudents: [...studentRows].sort((a, b) => a.averageScore - b.averageScore).slice(0, 5)
    },
    assignments: assignments.map((assignment) => ({
      id: assignment._id,
      title: assignment.title,
      type: assignment.type,
      dueDate: assignment.dueDate,
      course: assignment.course?.title || "Course",
      submissions: assignment.submissions.length,
      averageScore: Math.round(average(assignment.submissions.map((submission) => submission.score))),
      submissionDetails: assignment.submissions.slice(0, 5).map((submission) => ({
        studentId: submission.student?._id || submission.student,
        studentName: submission.student?.name || "Student",
        score: submission.score,
        feedback: submission.feedback,
        submissionUrl: submission.submissionUrl,
        submittedAt: submission.submittedAt
      }))
    })),
    liveSessions: liveSessions.map((session) => ({
      id: session._id,
      title: session.title,
      status: session.status,
      attendees: session.attendees,
      course: session.course?.title || "Course",
      transcript: session.transcript,
      notes: session.notes,
      startedAt: session.startedAt
    })),
    students: studentRows,
    performanceSeries: studentRows.slice(0, 7).map((student) => ({
      label: student.name.split(" ")[0],
      score: student.averageScore || 0,
      focus: student.focusScore || 0,
      attendance: student.attendanceRate || 0
    })),
    reports: riskAlerts.slice(0, 5).map((student) => ({
      studentName: student.name,
      parentEmail: students.find((item) => String(item._id) === String(student.id))?.parentContact?.email || "",
      risk: student.dropoutRisk,
      recommendation: `Focus on ${student.weakAreas[0] || "core fundamentals"} and increase guided practice this week.`
    }))
  };
};

const studentTwinMapFormatter = (student, twin) => ({
  ...student.learningProfile?.toObject?.(),
  ...(twin || {})
});

export const markAttendance = async ({ teacherId, courseId, date, entries }) =>
  AttendanceRecord.findOneAndUpdate(
    { course: courseId, date: new Date(date) },
    { $set: { teacher: teacherId, entries } },
    { new: true, upsert: true }
  );

export const createAssignment = async (payload) => Assignment.create(payload);

export const createParentMessage = async (payload) => ParentMessage.create(payload);

export const createLiveSession = async (payload) =>
  LiveSession.create({
    ...payload,
    transcript: "Auto-generated transcript placeholder. Connect a speech-to-text provider in production.",
    notes: "AI class notes placeholder generated from the session transcript."
  });

export const generateWeeklyReport = async ({ teacherId, studentId }) => {
  const student = await User.findById(studentId);
  const profile = await buildLearningTwin(studentId);

  const report = {
    teacherId,
    studentName: student?.name || "Student",
    parentEmail: student?.parentContact?.email || "",
    attendance: profile?.focusScore || 0,
    performance: profile?.accuracy || 0,
    weakAreas: profile?.weakAreas || [],
    suggestion: `Encourage a focused revision plan around ${profile?.weakAreas?.[0] || "core concepts"}.`
  };

  return report;
};

export const summarizeTeacherContent = async ({ title, description }) =>
  summarizeContent(`${title}\n${description}`);
