import { submitAssignment } from "../services/assignment.service.js";

export const postAssignmentSubmission = async (req, res) => {
  const assignment = await submitAssignment({
    assignmentId: req.params.id,
    studentId: req.user._id,
    submissionUrl: req.body.submissionUrl,
    notes: req.body.notes
  });

  res.status(201).json({ assignment });
};
