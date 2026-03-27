import { Announcement } from "../models/Announcement.js";
import { Assignment } from "../models/Assignment.js";
import { DocumentRequest } from "../models/DocumentRequest.js";
import { Enrollment } from "../models/Enrollment.js";
import { ExamSchedule } from "../models/ExamSchedule.js";
import { FeeRecord } from "../models/FeeRecord.js";
import { GuardianMeeting } from "../models/GuardianMeeting.js";
import { HostelPass } from "../models/HostelPass.js";
import { InternshipRecord } from "../models/InternshipRecord.js";
import { LibraryRecord } from "../models/LibraryRecord.js";
import { LeaveApplication } from "../models/LeaveApplication.js";
import { PlacementRecord } from "../models/PlacementRecord.js";
import { TimetableSlot } from "../models/TimetableSlot.js";
import { TransportPass } from "../models/TransportPass.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/api-error.js";
import { createSimplePdf } from "../utils/pdf.js";

const audienceFilter = (role) => (role === "teacher" ? ["all", "teachers"] : ["all", "students"]);

const toGradePoint = (percentage) => {
  if (percentage >= 90) return 10;
  if (percentage >= 80) return 9;
  if (percentage >= 70) return 8;
  if (percentage >= 60) return 7;
  if (percentage >= 50) return 6;
  if (percentage >= 45) return 5;
  if (percentage >= 40) return 4;
  return 0;
};

const getStudentCourseIds = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId }, "course");
  return enrollments.map((item) => String(item.course));
};

export const getPortalOverview = async (user) => {
  const [announcements, timetable, meetings] = await Promise.all([
    Announcement.find({ audience: { $in: audienceFilter(user.role) } })
      .populate("course", "title")
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 })
      .limit(8),
    TimetableSlot.find({ audience: { $in: audienceFilter(user.role) } })
      .populate("course", "title")
      .populate("teacher", "name")
      .sort({ dayOfWeek: 1, startTime: 1 }),
    GuardianMeeting.find(user.role === "teacher" ? { teacher: user._id } : { student: user._id })
      .populate("student", "name")
      .sort({ meetingDate: -1 })
      .limit(8)
  ]);

  const courseIds = user.role === "student" ? await getStudentCourseIds(user._id) : [];

  return {
    announcements: announcements
      .filter((item) => !item.course || user.role === "teacher" || courseIds.includes(String(item.course?._id)))
      .map((item) => ({
        id: item._id,
        title: item.title,
        body: item.body,
        courseTitle: item.course?.title || "",
        postedBy: item.postedBy?.name || "Faculty",
        createdAt: item.createdAt
      })),
    timetable: timetable
      .filter((item) => !item.course || user.role === "teacher" || courseIds.includes(String(item.course?._id)))
      .map((item) => ({
        id: item._id,
        title: item.title,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        room: item.room,
        courseTitle: item.course?.title || "",
        teacherName: item.teacher?.name || ""
      })),
    guardianMeetings: meetings.map((item) => ({
      id: item._id,
      studentName: item.student?.name || "Student",
      guardianName: item.guardianName,
      guardianEmail: item.guardianEmail,
      meetingDate: item.meetingDate,
      mode: item.mode,
      status: item.status,
      summary: item.summary,
      actionItems: item.actionItems
    }))
  };
};

export const getGradesOverview = async (user) => {
  const enrollments = await Enrollment.find({ user: user._id }).populate("course");
  const courseIds = enrollments.map((item) => item.course?._id).filter(Boolean);
  const assignments = await Assignment.find({ course: { $in: courseIds } }).populate("course");

  return {
    grades: assignments.map((assignment) => {
      const submission = assignment.submissions.find((item) => String(item.student) === String(user._id));
      return {
        id: assignment._id,
        title: assignment.title,
        type: assignment.type,
        courseTitle: assignment.course?.title || "Course",
        semester: assignment.course?.semester || "Semester 4",
        courseCredits: assignment.course?.credits || 4,
        dueDate: assignment.dueDate,
        score: submission?.score ?? null,
        feedback: submission?.feedback || "",
        submittedAt: submission?.submittedAt || null,
        status: submission ? "submitted" : "pending",
        maxScore: assignment.maxScore
      };
    })
  };
};

export const getResultsOverview = async (user) => {
  const { grades } = await getGradesOverview(user);
  const results = grades
    .filter((item) => item.score !== null)
    .map((item) => {
      const percentage = Math.round((item.score / item.maxScore) * 100);
      const internalMax = Math.round(item.maxScore * 0.4);
      const externalMax = item.maxScore - internalMax;
      const internalScore = Math.min(Math.round(item.score * 0.4), internalMax);
      const externalScore = Math.min(item.score - internalScore, externalMax);
      const gradePoint = toGradePoint(percentage);

      return {
        ...item,
        percentage,
        verdict: item.score >= item.maxScore * 0.4 ? "Pass" : "Needs improvement",
        marksBreakup: {
          internalScore,
          internalMax,
          externalScore,
          externalMax,
          totalScore: item.score,
          totalMax: item.maxScore
        },
        gradePoint
      };
    });

  const totalCredits = results.reduce((sum, item) => sum + (item.courseCredits || 0), 0);
  const weightedPoints = results.reduce((sum, item) => sum + item.gradePoint * (item.courseCredits || 0), 0);
  const sgpa = totalCredits ? Number((weightedPoints / totalCredits).toFixed(2)) : 0;
  const cgpa = totalCredits ? Number((((sgpa * 0.75) + 0.82)).toFixed(2)) : 0;

  return {
    results,
    summary: {
      semester: results[0]?.semester || "Semester 4",
      earnedCredits: totalCredits,
      sgpa,
      cgpa,
      publishedResults: results.length,
      passCount: results.filter((item) => item.verdict === "Pass").length,
      backlogCount: results.filter((item) => item.verdict !== "Pass").length,
      promotionStatus: results.every((item) => item.verdict === "Pass") ? "Eligible for progression" : "Backlog review required"
    }
  };
};

export const buildHallTicketPdf = async ({ requester, examId }) => {
  const exam = await ExamSchedule.findById(examId).populate("course", "title");
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  const hallTicketCode =
    requester.role === "student"
      ? `${exam.hallTicketCode}-${String(requester._id).slice(-4).toUpperCase()}`
      : exam.hallTicketCode;

  const lines = [
    "Official Hall Ticket",
    "",
    `Candidate: ${requester.name}`,
    `Email: ${requester.email}`,
    `Course: ${exam.course?.title || "Course"}`,
    `Examination: ${exam.title}`,
    `Date: ${new Date(exam.examDate).toLocaleDateString("en-IN")}`,
    `Time: ${exam.startTime} - ${exam.endTime}`,
    `Room: ${exam.room || "Main block"}`,
    `Seat Number: A-${String(requester._id).slice(-3).toUpperCase()}`,
    `Hall Ticket Code: ${hallTicketCode}`,
    "",
    "Instructions:",
    "1. Carry this hall ticket and your college ID card.",
    "2. Reach the examination venue 30 minutes before the start time.",
    "3. Electronic devices are not permitted unless explicitly approved."
  ];

  return createSimplePdf("Bibliotek X Hall Ticket", lines);
};

export const buildSeatAllotmentPdf = async ({ requester, examId }) => {
  const exam = await ExamSchedule.findById(examId).populate("course", "title");
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  const seatNumber = `A-${String(requester._id).slice(-3).toUpperCase()}`;
  const lines = [
    "Official Seat Allotment Slip",
    "",
    `Candidate: ${requester.name}`,
    `Roll Number: ${requester.rollNumber || "N/A"}`,
    `Course: ${exam.course?.title || "Course"}`,
    `Exam: ${exam.title}`,
    `Date: ${new Date(exam.examDate).toLocaleDateString("en-IN")}`,
    `Reporting Time: ${exam.startTime}`,
    `Room: ${exam.room || "Main block"}`,
    `Seat Number: ${seatNumber}`,
    "",
    "Carry this seat-allotment slip with your hall ticket on exam day."
  ];

  return createSimplePdf("Bibliotek X Seat Allotment", lines);
};

export const buildResultSheetPdf = async ({ requester, resultId }) => {
  const { results, summary } = await getResultsOverview(requester);
  const result = results.find((item) => String(item.id) === String(resultId));

  if (!result) {
    throw new ApiError(404, "Result not found");
  }

  const lines = [
    "Official Result Sheet",
    "",
    `Student: ${requester.name}`,
    `Email: ${requester.email}`,
    `Course: ${result.courseTitle}`,
    `Assessment: ${result.title}`,
    `Semester: ${result.semester}`,
    `Credits: ${result.courseCredits}`,
    `Status: ${result.verdict}`,
    `Score: ${result.score}/${result.maxScore}`,
    `Percentage: ${result.percentage}%`,
    `Internal Marks: ${result.marksBreakup.internalScore}/${result.marksBreakup.internalMax}`,
    `External Marks: ${result.marksBreakup.externalScore}/${result.marksBreakup.externalMax}`,
    `Grade Point: ${result.gradePoint}`,
    `SGPA Snapshot: ${summary.sgpa}`,
    `CGPA Snapshot: ${summary.cgpa}`,
    `Published On: ${new Date().toLocaleDateString("en-IN")}`,
    "",
    `Faculty Feedback: ${result.feedback || "Reviewed and published in the LMS portal."}`,
    "",
    "This is a system-generated result sheet from Bibliotek X."
  ];

  return createSimplePdf("Bibliotek X Result Sheet", lines);
};

export const getExamsOverview = async (user) => {
  const courseIds = user.role === "student" ? await getStudentCourseIds(user._id) : [];
  const exams = await ExamSchedule.find(
    user.role === "teacher" ? {} : { course: { $in: courseIds } }
  ).populate("course", "title").sort({ examDate: 1 });

  return {
    exams: exams.map((exam, index) => ({
      id: exam._id,
      title: exam.title,
      courseTitle: exam.course?.title || "Course",
      examDate: exam.examDate,
      startTime: exam.startTime,
      endTime: exam.endTime,
      room: exam.room,
      hallTicketCode:
        user.role === "student" ? `${exam.hallTicketCode}-${String(user._id).slice(-4).toUpperCase()}` : exam.hallTicketCode,
      seatNumber: user.role === "student" ? `A-${index + 11}` : null
    }))
  };
};

export const getFeesOverview = async (user) => {
  if (user.role === "teacher") {
    const records = await FeeRecord.find().populate("user", "name email").sort({ dueDate: 1 });
    return {
      fees: records.map((record) => ({
        id: record._id,
        userName: record.user?.name || "Student",
        term: record.term,
        totalAmount: record.totalAmount,
        paidAmount: record.paidAmount,
        dueDate: record.dueDate,
        status: record.status,
        items: record.items
      }))
    };
  }

  const records = await FeeRecord.find({ user: user._id }).sort({ dueDate: 1 });
  return {
    fees: records.map((record) => ({
      id: record._id,
      term: record.term,
      totalAmount: record.totalAmount,
      paidAmount: record.paidAmount,
      dueDate: record.dueDate,
      status: record.status,
      items: record.items
    }))
  };
};

export const buildFeeReceiptPdf = async ({ requester, feeId }) => {
  const fee = await FeeRecord.findOne({
    _id: feeId,
    ...(requester.role === "student" ? { user: requester._id } : {})
  }).populate("user", "name rollNumber program");

  if (!fee) {
    throw new ApiError(404, "Fee record not found");
  }

  const lines = [
    "Official Fee Receipt",
    "",
    `Student: ${fee.user?.name || requester.name}`,
    `Roll Number: ${fee.user?.rollNumber || requester.rollNumber || "N/A"}`,
    `Program: ${fee.user?.program || requester.program || "N/A"}`,
    `Term: ${fee.term}`,
    `Total Amount: Rs. ${fee.totalAmount}`,
    `Paid Amount: Rs. ${fee.paidAmount}`,
    `Status: ${fee.status}`,
    `Generated On: ${new Date().toLocaleDateString("en-IN")}`,
    "",
    "Fee Breakdown:"
  ];

  (fee.items || []).forEach((item) => {
    lines.push(`${item.label}: Rs. ${item.amount}`);
  });

  return createSimplePdf("Bibliotek X Fee Receipt", lines);
};

export const payFeeRecord = async ({ feeId, user }) => {
  const feeRecord = await FeeRecord.findOne({
    _id: feeId,
    ...(user.role === "student" ? { user: user._id } : {})
  });

  if (!feeRecord) {
    throw new ApiError(404, "Fee record not found");
  }

  feeRecord.paidAmount = feeRecord.totalAmount;
  feeRecord.status = "paid";
  await feeRecord.save();
  return feeRecord;
};

export const getLeaveOverview = async (user) => {
  const query = user.role === "teacher" ? {} : { user: user._id };
  const leaves = await LeaveApplication.find(query)
    .populate("user", "name email")
    .populate("reviewedBy", "name")
    .sort({ createdAt: -1 });

  return {
    leaveApplications: leaves.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      title: item.title,
      reason: item.reason,
      fromDate: item.fromDate,
      toDate: item.toDate,
      status: item.status,
      reviewNote: item.reviewNote,
      reviewedBy: item.reviewedBy?.name || "",
      reviewedAt: item.reviewedAt
    }))
  };
};

export const getGuardianMeetingOverview = async (user) => {
  const meetings = await GuardianMeeting.find(user.role === "teacher" ? { teacher: user._id } : { student: user._id })
    .populate("student", "name")
    .sort({ meetingDate: -1 });

  return {
    meetings: meetings.map((item) => ({
      id: item._id,
      studentName: item.student?.name || "Student",
      guardianName: item.guardianName,
      guardianEmail: item.guardianEmail,
      meetingDate: item.meetingDate,
      mode: item.mode,
      status: item.status,
      summary: item.summary,
      actionItems: item.actionItems
    }))
  };
};

export const createGuardianMeeting = async ({ user, payload }) => {
  const student = await User.findById(payload.studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return GuardianMeeting.create({
    teacher: user._id,
    student: payload.studentId,
    guardianName: payload.guardianName || student.parentContact?.name || "Guardian",
    guardianEmail: payload.guardianEmail || student.parentContact?.email || "",
    meetingDate: payload.meetingDate,
    mode: payload.mode || "call",
    status: payload.status || "scheduled",
    summary: payload.summary || "",
    actionItems: payload.actionItems || []
  });
};

export const getDocumentRequestOverview = async (user) => {
  const requests = await DocumentRequest.find(user.role === "teacher" ? {} : { user: user._id })
    .populate("user", "name email rollNumber department program academicYear")
    .sort({ createdAt: -1 });

  return {
    requests: requests.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      email: item.user?.email || "",
      rollNumber: item.user?.rollNumber || "",
      department: item.user?.department || "",
      program: item.user?.program || "",
      academicYear: item.user?.academicYear || "",
      type: item.type,
      purpose: item.purpose,
      status: item.status,
      remarks: item.remarks,
      createdAt: item.createdAt,
      approvedAt: item.approvedAt
    }))
  };
};

export const createDocumentRequest = async ({ user, payload }) =>
  DocumentRequest.create({
    user: user._id,
    type: payload.type,
    purpose: payload.purpose
  });

export const reviewDocumentRequest = async ({ id, status, remarks }) => {
  const request = await DocumentRequest.findById(id);
  if (!request) {
    throw new ApiError(404, "Document request not found");
  }

  request.status = status;
  request.remarks = remarks || "";
  request.approvedAt = status === "approved" ? new Date() : null;
  await request.save();
  return request;
};

export const buildDocumentPdf = async ({ requester, requestId }) => {
  const request = await DocumentRequest.findById(requestId).populate("user");
  if (!request) {
    throw new ApiError(404, "Document request not found");
  }

  if (requester.role === "student" && String(request.user?._id) !== String(requester._id)) {
    throw new ApiError(403, "Forbidden");
  }

  if (request.status !== "approved") {
    throw new ApiError(400, "Document is not approved yet");
  }

  const lines = [
    "Official Student Document",
    "",
    `Document Type: ${request.type}`,
    `Student Name: ${request.user?.name || "Student"}`,
    `Roll Number: ${request.user?.rollNumber || "N/A"}`,
    `Program: ${request.user?.program || "N/A"}`,
    `Department: ${request.user?.department || "N/A"}`,
    `Academic Year: ${request.user?.academicYear || "N/A"}`,
    `Purpose: ${request.purpose}`,
    `Approved On: ${request.approvedAt ? new Date(request.approvedAt).toLocaleDateString("en-IN") : "N/A"}`,
    "",
    "This certificate is digitally issued by Bibliotek X campus administration."
  ];

  return createSimplePdf("Bibliotek X Official Document", lines);
};

export const getHostelPassOverview = async (user) => {
  const passes = await HostelPass.find(user.role === "teacher" ? {} : { user: user._id })
    .populate("user", "name rollNumber")
    .sort({ validUntil: 1 });

  return {
    hostelPasses: passes.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      rollNumber: item.user?.rollNumber || "",
      hostelName: item.hostelName,
      roomNumber: item.roomNumber,
      wardenName: item.wardenName,
      status: item.status,
      validUntil: item.validUntil
    }))
  };
};

export const getTransportPassOverview = async (user) => {
  const passes = await TransportPass.find(user.role === "teacher" ? {} : { user: user._id })
    .populate("user", "name rollNumber")
    .sort({ validUntil: 1 });

  return {
    transportPasses: passes.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      rollNumber: item.user?.rollNumber || "",
      routeName: item.routeName,
      stopName: item.stopName,
      vehicleNumber: item.vehicleNumber,
      status: item.status,
      validUntil: item.validUntil
    }))
  };
};

export const getPlacementOverview = async (user) => {
  const records = await PlacementRecord.find(user.role === "teacher" ? {} : { user: user._id })
    .populate("user", "name rollNumber program")
    .sort({ driveDate: -1 });

  return {
    placements: records.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      rollNumber: item.user?.rollNumber || "",
      program: item.user?.program || "",
      companyName: item.companyName,
      roleTitle: item.roleTitle,
      packageLpa: item.packageLpa,
      status: item.status,
      driveDate: item.driveDate
    }))
  };
};

export const getInternshipOverview = async (user) => {
  const records = await InternshipRecord.find(user.role === "teacher" ? {} : { user: user._id })
    .populate("user", "name rollNumber program")
    .sort({ createdAt: -1 });

  return {
    internships: records.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      rollNumber: item.user?.rollNumber || "",
      program: item.user?.program || "",
      companyName: item.companyName,
      domain: item.domain,
      duration: item.duration,
      status: item.status,
      mentorName: item.mentorName
    }))
  };
};

export const getLibraryOverview = async (user) => {
  const records = await LibraryRecord.find(user.role === "teacher" ? {} : { user: user._id })
    .populate("user", "name rollNumber")
    .sort({ dueDate: 1 });

  return {
    libraryRecords: records.map((item) => ({
      id: item._id,
      userName: item.user?.name || "Student",
      rollNumber: item.user?.rollNumber || "",
      bookTitle: item.bookTitle,
      accessionCode: item.accessionCode,
      issueDate: item.issueDate,
      dueDate: item.dueDate,
      returnDate: item.returnDate,
      status: item.status,
      fineAmount: item.fineAmount
    }))
  };
};

export const buildReportCardPdf = async ({ requester, studentId = null }) => {
  const targetUserId = studentId || requester._id;
  if (requester.role === "student" && studentId && String(studentId) !== String(requester._id)) {
    throw new ApiError(403, "Forbidden");
  }

  const student = await User.findById(targetUserId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const [gradesOverview, examsOverview, feesOverview] = await Promise.all([
    getGradesOverview({ ...requester.toObject?.(), _id: targetUserId, role: "student" }),
    getExamsOverview({ ...requester.toObject?.(), _id: targetUserId, role: "student" }),
    getFeesOverview({ ...requester.toObject?.(), _id: targetUserId, role: "student" })
  ]);

  const lines = [
    `Student: ${student.name}`,
    `Email: ${student.email}`,
    `Role: ${student.role}`,
    `XP: ${student.xp}`,
    `Focus Score: ${student.learningProfile?.focusScore || 0}`,
    `Weak Areas: ${(student.learningProfile?.weakAreas || []).join(", ") || "Stable"}`,
    "",
    "Grades:"
  ];

  gradesOverview.grades.slice(0, 8).forEach((grade) => {
    lines.push(`${grade.courseTitle} | ${grade.title} | ${grade.score ?? "-"} / ${grade.maxScore} | ${grade.status}`);
  });

  lines.push("", "Upcoming Exams:");
  examsOverview.exams.slice(0, 5).forEach((exam) => {
    lines.push(`${exam.courseTitle} | ${exam.title} | ${new Date(exam.examDate).toLocaleDateString("en-IN")} | ${exam.hallTicketCode}`);
  });

  lines.push("", "Fee Status:");
  feesOverview.fees.slice(0, 3).forEach((fee) => {
    lines.push(`${fee.term} | Paid ${fee.paidAmount}/${fee.totalAmount} | ${fee.status}`);
  });

  return createSimplePdf("Bibliotek X Report Card", lines);
};

export const createLeave = async ({ user, payload }) =>
  LeaveApplication.create({
    user: user._id,
    title: payload.title,
    reason: payload.reason,
    fromDate: payload.fromDate,
    toDate: payload.toDate
  });

export const reviewLeave = async ({ id, reviewer, status, reviewNote }) => {
  const leave = await LeaveApplication.findById(id);
  if (!leave) {
    throw new ApiError(404, "Leave application not found");
  }

  leave.status = status;
  leave.reviewNote = reviewNote || "";
  leave.reviewedBy = reviewer._id;
  leave.reviewedAt = new Date();
  await leave.save();
  return leave;
};
