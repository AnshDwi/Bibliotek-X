import {
  createAssignment,
  createLiveSession,
  createParentMessage,
  generateWeeklyReport,
  getTeacherDashboardData,
  markAttendance,
  summarizeTeacherContent
} from "../services/teacher.service.js";

export const getTeacherDashboard = async (req, res) => {
  const dashboard = await getTeacherDashboardData(req.user._id);
  res.json(dashboard);
};

export const postAttendance = async (req, res) => {
  const attendance = await markAttendance({
    teacherId: req.user._id,
    courseId: req.body.courseId,
    date: req.body.date,
    entries: req.body.entries
  });

  res.status(201).json({ attendance });
};

export const postAssignment = async (req, res) => {
  const assignment = await createAssignment({
    ...req.body,
    teacher: req.user._id
  });

  res.status(201).json({ assignment });
};

export const postParentMessage = async (req, res) => {
  const message = await createParentMessage({
    ...req.body,
    teacher: req.user._id
  });

  res.status(201).json({ message });
};

export const postLiveSession = async (req, res) => {
  const session = await createLiveSession({
    ...req.body,
    teacher: req.user._id
  });

  res.status(201).json({ session });
};

export const getWeeklyReport = async (req, res) => {
  const report = await generateWeeklyReport({
    teacherId: req.user._id,
    studentId: req.params.studentId
  });

  res.json({ report });
};

export const postContentSummary = async (req, res) => {
  const summary = await summarizeTeacherContent(req.body);
  res.json(summary);
};

