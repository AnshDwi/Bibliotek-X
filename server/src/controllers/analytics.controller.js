import { AttendanceRecord } from "../models/AttendanceRecord.js";
import { Assignment } from "../models/Assignment.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { FocusSession } from "../models/FocusSession.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { User } from "../models/User.js";
import { buildLearningTwin } from "../services/analytics/digital-twin.service.js";

const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const getStudentAnalytics = async (req, res) => {
  const [profile, attempts, sessions, enrollments] = await Promise.all([
    buildLearningTwin(req.user._id),
    QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10),
    FocusSession.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10),
    Enrollment.find({ user: req.user._id }).populate("course")
  ]);

  const courseIds = enrollments.map((enrollment) => enrollment.course?._id).filter(Boolean);
  const [attendanceRecords, assignments] = await Promise.all([
    AttendanceRecord.find({ course: { $in: courseIds } }).populate("course"),
    Assignment.find({ course: { $in: courseIds } }).sort({ dueDate: 1 }).limit(10).populate("course")
  ]);

  const efficiencyScore = Math.round(
    average(attempts.map((item) => item.score)) * 0.6 +
      average(sessions.map((item) => item.focusScore)) * 0.4
  );

  const attendanceCalendar = attendanceRecords
    .map((record) => {
      const entry = record.entries.find((item) => String(item.student) === String(req.user._id));
      if (!entry) {
        return null;
      }

      return {
        date: record.date,
        status: entry.status,
        courseTitle: record.course?.title || "Course"
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const presentClasses = attendanceCalendar.filter((entry) => entry.status === "present").length;
  const lateClasses = attendanceCalendar.filter((entry) => entry.status === "late").length;
  const absentClasses = attendanceCalendar.filter((entry) => entry.status === "absent").length;
  const totalClasses = attendanceCalendar.length;
  const attendanceRate = totalClasses
    ? Math.round(((presentClasses + lateClasses * 0.5) / totalClasses) * 100)
    : 0;
  const upcomingAssignments = assignments
    .filter((assignment) => new Date(assignment.dueDate).getTime() >= Date.now())
    .slice(0, 5)
    .map((assignment) => ({
      id: assignment._id,
      title: assignment.title,
      type: assignment.type,
      dueDate: assignment.dueDate,
      courseTitle: assignment.course?.title || "Course"
    }));
  const nextTopic = profile?.nextBestTopics?.[0];
  const weakestArea = profile?.weakAreas?.[0];
  const nextAssignment = upcomingAssignments[0];
  const nextAction = nextAssignment
      ? {
        title: `Next deadline: ${nextAssignment.title}`,
        description: `${nextAssignment.courseTitle} is due on ${new Date(nextAssignment.dueDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })}. Finish this first to stay ahead of your schedule.`,
        sectionId: "dashboard-courses",
        routePath: "/courses"
      }
    : {
        title: nextTopic ? `Continue with ${nextTopic}` : "Review your latest course module",
        description: weakestArea
          ? `Your weakest area is ${weakestArea}. Spend one focused session there next.`
          : "Stay consistent with your current path and complete the next learning activity.",
        sectionId: nextTopic ? "dashboard-graph" : "dashboard-courses",
        routePath: nextTopic ? "/knowledge-graph" : "/courses"
      };

  res.json({
    profile,
    efficiencyScore,
    recentQuizScores: attempts.map((item) => ({
      date: item.createdAt,
      value: item.score
    })),
    recentFocusScores: sessions.map((item) => ({
      date: item.createdAt,
      value: item.focusScore
    })),
    burnoutIndicator:
      average(sessions.map((item) => item.durationMinutes)) > 120 && profile?.focusScore < 60
        ? "watch"
        : "healthy",
    attendanceCalendar,
    attendanceSummary: {
      totalClasses,
      presentClasses,
      lateClasses,
      absentClasses,
      attendanceRate
    },
    upcomingAssignments,
    nextAction
  });
};

export const getAdminAnalytics = async (_req, res) => {
  const [userCount, courseCount, activeStudents, focusSessions] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    User.countDocuments({ role: "student" }),
    FocusSession.find().sort({ createdAt: -1 }).limit(20)
  ]);

  res.json({
    overview: {
      userCount,
      courseCount,
      activeStudents
    },
    focusSessions
  });
};

export const getLeaderboard = async (_req, res) => {
  const leaderboard = await User.find({}, "name xp streak role")
    .sort({ xp: -1, streak: -1, createdAt: 1 })
    .limit(10);

  res.json({
    leaderboard
  });
};
