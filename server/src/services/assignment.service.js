import { Assignment } from "../models/Assignment.js";
import { ApiError } from "../utils/api-error.js";

export const submitAssignment = async ({ assignmentId, studentId, submissionUrl, notes }) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  const existingSubmission = assignment.submissions.find(
    (submission) => String(submission.student) === String(studentId)
  );

  if (existingSubmission) {
    existingSubmission.submissionUrl = submissionUrl || existingSubmission.submissionUrl;
    existingSubmission.notes = notes || existingSubmission.notes;
    existingSubmission.submittedAt = new Date();
  } else {
    assignment.submissions.push({
      student: studentId,
      submissionUrl,
      notes,
      submittedAt: new Date()
    });
  }

  await assignment.save();

  return assignment;
};
