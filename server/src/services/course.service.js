import { Assignment } from "../models/Assignment.js";
import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { Content } from "../models/Content.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { ApiError } from "../utils/api-error.js";

export const listCourses = async () =>
  Course.find().populate("teacher", "name role avatarUrl").sort({ createdAt: -1 });

export const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate("teacher", "name role avatarUrl");
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

export const createCourse = async (payload) => Course.create(payload);

export const updateCourse = async (courseId, payload) => {
  const course = await Course.findByIdAndUpdate(courseId, payload, { new: true });
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return course;
};

export const enrollInCourse = async (userId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const enrollment = await Enrollment.findOneAndUpdate(
    { user: userId, course: courseId },
    { $setOnInsert: { user: userId, course: courseId } },
    { new: true, upsert: true }
  );

  course.enrollmentCount += 1;
  await course.save();

  return enrollment;
};

export const listEnrollmentsForUser = async (userId) =>
  {
    const enrollments = await Enrollment.find({ user: userId }).populate("course").sort({ updatedAt: -1 });
    const attendanceRecords = await AttendanceRecord.find({ course: { $in: enrollments.map((item) => item.course?._id).filter(Boolean) } });

    return enrollments.map((enrollment) => {
      const records = attendanceRecords.filter((record) => String(record.course) === String(enrollment.course?._id));
      const entries = records
        .map((record) => record.entries.find((entry) => String(entry.student) === String(userId)))
        .filter(Boolean);
      const attendanceRate = entries.length
        ? Math.round(((entries.filter((entry) => entry.status === "present").length + entries.filter((entry) => entry.status === "late").length * 0.5) / entries.length) * 100)
        : 0;

      return {
        ...enrollment.toObject(),
        attendanceRate
      };
    });
  };

export const getCoursePortalDetails = async (courseId, user = null) => {
  const [course, content, assignments, enrollments, attendanceRecords] = await Promise.all([
    Course.findById(courseId).populate("teacher", "name email"),
    Content.find({ course: courseId }).sort({ createdAt: -1 }),
    Assignment.find({ course: courseId }).sort({ dueDate: 1 }).populate("submissions.student", "name email"),
    Enrollment.find({ course: courseId }).populate("user", "name email"),
    AttendanceRecord.find({ course: courseId }).sort({ date: -1 }).limit(12)
  ]);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const attendanceEntriesForUser = user?._id
    ? attendanceRecords
        .map((record) => record.entries.find((entry) => String(entry.student) === String(user._id)))
        .filter(Boolean)
    : [];
  const totalAttendanceEntries = attendanceRecords.flatMap((record) => record.entries);
  const personalAttendanceRate = attendanceEntriesForUser.length
    ? Math.round(
        ((attendanceEntriesForUser.filter((entry) => entry.status === "present").length +
          attendanceEntriesForUser.filter((entry) => entry.status === "late").length * 0.5) /
          attendanceEntriesForUser.length) *
          100
      )
    : 0;
  const classAttendanceRate = totalAttendanceEntries.length
    ? Math.round(
        ((totalAttendanceEntries.filter((entry) => entry.status === "present").length +
          totalAttendanceEntries.filter((entry) => entry.status === "late").length * 0.5) /
          totalAttendanceEntries.length) *
          100
      )
    : 0;

  return {
    course,
    content: content.map((item) => ({
      _id: item._id,
      title: item.title,
      type: item.type,
      description: item.description,
      textContent: item.textContent,
      extractedTopics: item.extractedTopics,
      summary: item.summary,
      fileUrl: item.fileUrl
    })),
    assignments: assignments.map((assignment) => {
      const mySubmission = user?._id
        ? assignment.submissions.find((submission) => String(submission.student) === String(user._id))
        : null;

      return {
        _id: assignment._id,
        title: assignment.title,
        type: assignment.type,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxScore: assignment.maxScore,
        submissionsCount: assignment.submissions.length,
        submissions:
          user?.role === "teacher"
            ? assignment.submissions.map((submission) => ({
                studentId: submission.student?._id || submission.student,
                studentName: submission.student?.name || "Student",
                submittedAt: submission.submittedAt,
                submissionUrl: submission.submissionUrl,
                notes: submission.notes,
                score: submission.score,
                feedback: submission.feedback
              }))
            : [],
        mySubmission: mySubmission
          ? {
              submittedAt: mySubmission.submittedAt,
              submissionUrl: mySubmission.submissionUrl,
              notes: mySubmission.notes,
              score: mySubmission.score,
              feedback: mySubmission.feedback
            }
          : null
      };
    }),
    enrollments: enrollments.map((enrollment) => ({
      id: enrollment._id,
      progress: enrollment.progress,
      status: enrollment.status,
      lastAccessedAt: enrollment.lastAccessedAt,
      user: enrollment.user
    })),
    attendanceRecords: attendanceRecords.map((record) => ({
      id: record._id,
      date: record.date,
      presentCount: record.entries.filter((entry) => entry.status === "present").length,
      lateCount: record.entries.filter((entry) => entry.status === "late").length,
      absentCount: record.entries.filter((entry) => entry.status === "absent").length
    })),
    attendanceSummary: {
      personalAttendanceRate,
      classAttendanceRate,
      sessionsTracked: attendanceRecords.length,
      presentSessions: attendanceEntriesForUser.filter((entry) => entry.status === "present").length,
      lateSessions: attendanceEntriesForUser.filter((entry) => entry.status === "late").length,
      absentSessions: attendanceEntriesForUser.filter((entry) => entry.status === "absent").length,
      classPresentEntries: totalAttendanceEntries.filter((entry) => entry.status === "present").length,
      classLateEntries: totalAttendanceEntries.filter((entry) => entry.status === "late").length,
      classAbsentEntries: totalAttendanceEntries.filter((entry) => entry.status === "absent").length
    }
  };
};
