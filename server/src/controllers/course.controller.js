import {
  createCourse,
  enrollInCourse,
  getCourseById,
  getCoursePortalDetails,
  listCourses,
  listEnrollmentsForUser,
  updateCourse
} from "../services/course.service.js";

export const getCourses = async (_req, res) => {
  const courses = await listCourses();
  res.json({ courses });
};

export const getCourse = async (req, res) => {
  const course = await getCourseById(req.params.id);
  res.json({ course });
};

export const postCourse = async (req, res) => {
  const course = await createCourse({
    ...req.body,
    teacher: req.user._id
  });
  res.status(201).json({ course });
};

export const patchCourse = async (req, res) => {
  const course = await updateCourse(req.params.id, req.body);
  res.json({ course });
};

export const postEnrollment = async (req, res) => {
  const enrollment = await enrollInCourse(req.user._id, req.params.id);
  res.status(201).json({ enrollment });
};

export const getMyEnrollments = async (req, res) => {
  const enrollments = await listEnrollmentsForUser(req.user._id);
  res.json({ enrollments });
};

export const getCoursePortal = async (req, res) => {
  const portal = await getCoursePortalDetails(req.params.id, req.user);
  res.json(portal);
};
