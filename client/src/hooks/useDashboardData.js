import { useEffect, useState } from "react";

import { api } from "../api/http.js";
import {
  analytics as fallbackAnalytics,
  courses as fallbackCourses,
  graph as fallbackGraph,
  leaderboard as fallbackLeaderboard,
  notifications as fallbackNotifications,
  user as fallbackUser
} from "../data/mockData.js";

const fallbackTeacher = {
  overview: {
    courses: 0,
    students: 0,
    attendanceRate: 0,
    engagementScore: 0,
    dropoutRiskCount: 0
  },
  courses: [],
  graph: fallbackGraph,
  attendance: {
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      lowAttendanceAlerts: [],
      recentRegisters: []
    },
  content: [],
  parentMessages: [],
  classHealth: {
    weakTopics: [],
    topPerformers: [],
    strugglingStudents: []
  },
  assignments: [],
  liveSessions: [],
  students: [],
  performanceSeries: [],
  reports: []
};

const formatChartDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
};

export const useDashboardData = (authUser) => {
  const [state, setState] = useState({
    loading: true,
    analytics: fallbackAnalytics,
    attendanceCalendar: [],
    attendanceSummary: {
      totalClasses: 0,
      presentClasses: 0,
      lateClasses: 0,
      absentClasses: 0,
      attendanceRate: 0
    },
    upcomingAssignments: [],
    nextAction: null,
    courses: fallbackCourses,
    graph: fallbackGraph,
    notifications: fallbackNotifications,
    leaderboard: fallbackLeaderboard,
    announcements: [],
    exams: [],
    fees: [],
    grades: [],
    results: [],
    resultsSummary: {
      semester: "Semester 4",
      earnedCredits: 0,
      sgpa: 0,
      cgpa: 0,
      publishedResults: 0,
      passCount: 0,
      backlogCount: 0,
      promotionStatus: "Eligible for progression"
    },
    timetable: [],
    leaves: [],
    meetings: [],
    documentRequests: [],
    hostelPasses: [],
    transportPasses: [],
    placements: [],
    internships: [],
    libraryRecords: [],
    teacher: fallbackTeacher,
    error: "",
    user: authUser
      ? {
          ...fallbackUser,
          ...authUser,
          learningProfile: {
            ...fallbackUser.learningProfile,
            ...(authUser.learningProfile || {})
          }
        }
      : fallbackUser
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!authUser) {
      setState((current) => ({ ...current, loading: false }));
      return;
    }

    let isMounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true }));

      try {
        const commonRequests = [
          api.get("/notifications"),
          api.get("/analytics/leaderboard"),
          api.get("/portal"),
          api.get("/portal/grades"),
          api.get("/portal/results"),
          api.get("/portal/exams"),
          api.get("/portal/fees"),
          api.get("/portal/leaves"),
          api.get("/portal/meetings"),
          api.get("/portal/documents"),
          api.get("/portal/hostel"),
          api.get("/portal/transport"),
          api.get("/portal/placements"),
          api.get("/portal/internships"),
          api.get("/portal/library")
        ];
        const roleRequests =
          authUser.role === "teacher"
            ? [api.get("/teacher/dashboard")]
            : [api.get("/analytics/student"), api.get("/courses/me/enrollments")];
        const responses = await Promise.all([...roleRequests, ...commonRequests]);

        if (!isMounted) {
          return;
        }

        const notificationsRes = responses[responses.length - 15];
        const leaderboardRes = responses[responses.length - 14];
        const portalRes = responses[responses.length - 13];
        const gradesRes = responses[responses.length - 12];
        const resultsRes = responses[responses.length - 11];
        const examsRes = responses[responses.length - 10];
        const feesRes = responses[responses.length - 9];
        const leavesRes = responses[responses.length - 8];
        const meetingsRes = responses[responses.length - 7];
        const documentsRes = responses[responses.length - 6];
        const hostelRes = responses[responses.length - 5];
        const transportRes = responses[responses.length - 4];
        const placementsRes = responses[responses.length - 3];
        const internshipsRes = responses[responses.length - 2];
        const libraryRes = responses[responses.length - 1];
        const teacherPayload = authUser.role === "teacher" ? responses[0].data : null;
        const liveAnalytics =
          authUser.role === "teacher"
            ? {
                efficiencyScore: teacherPayload?.overview?.engagementScore ?? fallbackAnalytics.efficiencyScore,
                burnoutIndicator:
                  teacherPayload?.overview?.dropoutRiskCount > 0 ? "watch" : fallbackAnalytics.burnoutIndicator,
                recentQuizScores:
                  teacherPayload?.performanceSeries?.map((item) => ({
                    date: item.label,
                    value: item.score
                  })) || fallbackAnalytics.recentQuizScores,
                recentFocusScores:
                  teacherPayload?.performanceSeries?.map((item) => ({
                    date: item.label,
                    value: item.focus
                  })) || fallbackAnalytics.recentFocusScores
              }
            : responses[0].data;
        const enrollments = authUser.role === "teacher" ? [] : responses[1].data.enrollments || [];
        const liveCourses =
          authUser.role === "teacher"
            ? teacherPayload?.courses?.length
              ? teacherPayload.courses
              : fallbackCourses
            : enrollments.length
              ? enrollments.map((enrollment) => ({
                  ...enrollment.course,
                  progress: enrollment.progress ?? 0,
                  attendanceRate: enrollment.attendanceRate ?? 0
                }))
              : fallbackCourses;
        const liveGraph =
          authUser.role === "teacher"
            ? teacherPayload?.graph?.nodes?.length
              ? teacherPayload.graph
              : fallbackGraph
            : enrollments[0]?.course?.knowledgeGraph?.nodes?.length
              ? enrollments[0].course.knowledgeGraph
              : fallbackGraph;

        setState({
          loading: false,
          analytics: {
            efficiencyScore: liveAnalytics.efficiencyScore ?? fallbackAnalytics.efficiencyScore,
            burnoutIndicator: liveAnalytics.burnoutIndicator ?? fallbackAnalytics.burnoutIndicator,
            recentQuizScores:
              liveAnalytics.recentQuizScores?.map((item) => ({
                date: formatChartDate(item.date),
                value: item.value
              })) || fallbackAnalytics.recentQuizScores,
            recentFocusScores:
              liveAnalytics.recentFocusScores?.map((item) => ({
                date: formatChartDate(item.date),
                value: item.value
              })) || fallbackAnalytics.recentFocusScores
          },
          attendanceCalendar: liveAnalytics.attendanceCalendar || [],
          attendanceSummary: liveAnalytics.attendanceSummary || {
            totalClasses: 0,
            presentClasses: 0,
            lateClasses: 0,
            absentClasses: 0,
            attendanceRate: 0
          },
          upcomingAssignments: liveAnalytics.upcomingAssignments || [],
          nextAction: liveAnalytics.nextAction || null,
          courses: liveCourses,
          graph: liveGraph,
          notifications: notificationsRes.data.notifications?.length
            ? notificationsRes.data.notifications.map((item) => ({
                id: item._id,
                title: item.title,
                body: item.body,
                type: item.type,
                read: item.read
              }))
            : fallbackNotifications,
          leaderboard: leaderboardRes.data.leaderboard?.length
            ? leaderboardRes.data.leaderboard.map((item) => ({
                name: item.name,
                xp: item.xp,
                streak: item.streak,
                role: item.role
              }))
            : fallbackLeaderboard,
          announcements: portalRes.data.announcements || [],
          exams: examsRes.data.exams || [],
          fees: feesRes.data.fees || [],
          grades: gradesRes.data.grades || [],
          results: resultsRes.data.results || [],
          resultsSummary: resultsRes.data.summary || {
            semester: "Semester 4",
            earnedCredits: 0,
            sgpa: 0,
            cgpa: 0,
            publishedResults: 0,
            passCount: 0,
            backlogCount: 0,
            promotionStatus: "Eligible for progression"
          },
          timetable: portalRes.data.timetable || [],
          leaves: leavesRes.data.leaveApplications || [],
          meetings: meetingsRes.data.meetings || [],
          documentRequests: documentsRes.data.requests || [],
          hostelPasses: hostelRes.data.hostelPasses || [],
          transportPasses: transportRes.data.transportPasses || [],
          placements: placementsRes.data.placements || [],
          internships: internshipsRes.data.internships || [],
          libraryRecords: libraryRes.data.libraryRecords || [],
          teacher: teacherPayload || fallbackTeacher,
          error: "",
          user: {
            ...fallbackUser,
            ...authUser,
            learningProfile: {
              ...fallbackUser.learningProfile,
              ...(teacherPayload?.students?.[0]?.weakAreas
                ? authUser.learningProfile || {}
                : liveAnalytics.profile || authUser.learningProfile || {})
            }
          }
        });
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setState((current) => ({
          ...current,
          loading: false,
          attendanceCalendar: [],
          attendanceSummary: {
            totalClasses: 0,
            presentClasses: 0,
            lateClasses: 0,
            absentClasses: 0,
            attendanceRate: 0
          },
          upcomingAssignments: [],
          nextAction: null,
          announcements: [],
          exams: [],
          fees: [],
          grades: [],
          results: [],
          resultsSummary: {
            semester: "Semester 4",
            earnedCredits: 0,
            sgpa: 0,
            cgpa: 0,
            publishedResults: 0,
            passCount: 0,
            backlogCount: 0,
            promotionStatus: "Eligible for progression"
          },
          timetable: [],
          leaves: [],
          meetings: [],
          documentRequests: [],
          hostelPasses: [],
          transportPasses: [],
          placements: [],
          internships: [],
          libraryRecords: [],
          teacher: fallbackTeacher,
          error: "We could not load live dashboard data, so some sections are showing fallback content.",
          user: {
            ...fallbackUser,
            ...authUser,
            learningProfile: {
              ...fallbackUser.learningProfile,
              ...(authUser.learningProfile || {})
            }
          }
        }));
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [authUser, reloadKey]);

  return {
    ...state,
    reload: () => setReloadKey((current) => current + 1),
    markNotificationRead: async (notificationId) => {
      await api.patch(`/notifications/${notificationId}/read`);
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      }));
    }
  };
};
