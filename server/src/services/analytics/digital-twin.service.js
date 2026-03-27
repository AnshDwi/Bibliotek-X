import { Enrollment } from "../../models/Enrollment.js";
import { FocusSession } from "../../models/FocusSession.js";
import { QuizAttempt } from "../../models/QuizAttempt.js";
import { User } from "../../models/User.js";

const average = (values) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export const buildLearningTwin = async (userId) => {
  const [user, enrollments, quizAttempts, focusSessions] = await Promise.all([
    User.findById(userId),
    Enrollment.find({ user: userId }).populate("course"),
    QuizAttempt.find({ user: userId }),
    FocusSession.find({ user: userId })
  ]);

  if (!user) {
    return null;
  }

  const accuracy = average(quizAttempts.map((attempt) => attempt.score));
  const learningSpeed = average(enrollments.map((enrollment) => enrollment.progress || 0)) / 10 || 1;
  const focusScore = average(focusSessions.map((session) => session.focusScore));
  const timeSpentMinutes = focusSessions.reduce(
    (sum, session) => sum + session.durationMinutes,
    0
  );

  const topicPerformance = {};
  quizAttempts.forEach((attempt) => {
    attempt.answers.forEach((answer) => {
      if (!topicPerformance[answer.prompt]) {
        topicPerformance[answer.prompt] = [];
      }
      topicPerformance[answer.prompt].push(answer.isCorrect ? 100 : 30);
    });
  });

  const masteryMap = Object.entries(topicPerformance).map(([topic, scores]) => ({
    topic,
    score: Math.round(average(scores)),
    trend: average(scores) > 75 ? "up" : "watch"
  }));

  const weakAreas = masteryMap.filter((item) => item.score < 60).map((item) => item.topic);
  const strongAreas = masteryMap.filter((item) => item.score >= 80).map((item) => item.topic);

  let dropoutRisk = "low";
  if (focusScore < 55 || accuracy < 55 || timeSpentMinutes < 60) {
    dropoutRisk = "high";
  } else if (focusScore < 70 || accuracy < 70) {
    dropoutRisk = "medium";
  }

  const nextBestTopics = enrollments
    .flatMap((enrollment) => enrollment.course?.knowledgeGraph?.nodes || [])
    .map((node) => node.label)
    .filter((label) => !strongAreas.includes(label))
    .slice(0, 5);

  user.learningProfile = {
    timeSpentMinutes,
    accuracy: Math.round(accuracy),
    learningSpeed: Number(learningSpeed.toFixed(2)),
    focusScore: Math.round(focusScore),
    weakAreas,
    strongAreas,
    dropoutRisk,
    nextBestTopics,
    masteryMap
  };

  await user.save();
  return user.learningProfile;
};

