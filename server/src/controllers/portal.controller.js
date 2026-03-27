import {
  buildDocumentPdf,
  buildFeeReceiptPdf,
  buildHallTicketPdf,
  buildReportCardPdf,
  buildResultSheetPdf,
  buildSeatAllotmentPdf,
  createDocumentRequest,
  createGuardianMeeting,
  createLeave,
  getDocumentRequestOverview,
  getExamsOverview,
  getFeesOverview,
  getGuardianMeetingOverview,
  getGradesOverview,
  getHostelPassOverview,
  getInternshipOverview,
  getLibraryOverview,
  getLeaveOverview,
  getPlacementOverview,
  getPortalOverview,
  getResultsOverview,
  getTransportPassOverview,
  payFeeRecord,
  reviewDocumentRequest,
  reviewLeave
} from "../services/portal.service.js";

export const getPortal = async (req, res) => {
  const overview = await getPortalOverview(req.user);
  res.json(overview);
};

export const getGrades = async (req, res) => {
  const grades = await getGradesOverview(req.user);
  res.json(grades);
};

export const getResults = async (req, res) => {
  const results = await getResultsOverview(req.user);
  res.json(results);
};

export const getExams = async (req, res) => {
  const exams = await getExamsOverview(req.user);
  res.json(exams);
};

export const downloadSeatAllotment = async (req, res) => {
  const pdfBuffer = await buildSeatAllotmentPdf({
    requester: req.user,
    examId: req.params.id
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"bibliotek-x-seat-allotment.pdf\"");
  res.send(pdfBuffer);
};

export const getFees = async (req, res) => {
  const fees = await getFeesOverview(req.user);
  res.json(fees);
};

export const postFeePayment = async (req, res) => {
  const fee = await payFeeRecord({ feeId: req.params.id, user: req.user });
  res.json({ fee });
};

export const downloadFeeReceipt = async (req, res) => {
  const pdfBuffer = await buildFeeReceiptPdf({
    requester: req.user,
    feeId: req.params.id
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"bibliotek-x-fee-receipt.pdf\"");
  res.send(pdfBuffer);
};

export const getLeaves = async (req, res) => {
  const leaves = await getLeaveOverview(req.user);
  res.json(leaves);
};

export const getGuardianMeetings = async (req, res) => {
  const meetings = await getGuardianMeetingOverview(req.user);
  res.json(meetings);
};

export const postGuardianMeeting = async (req, res) => {
  const meeting = await createGuardianMeeting({ user: req.user, payload: req.body });
  res.status(201).json({ meeting });
};

export const getDocumentRequests = async (req, res) => {
  const requests = await getDocumentRequestOverview(req.user);
  res.json(requests);
};

export const postDocumentRequest = async (req, res) => {
  const request = await createDocumentRequest({ user: req.user, payload: req.body });
  res.status(201).json({ request });
};

export const patchDocumentRequest = async (req, res) => {
  const request = await reviewDocumentRequest({
    id: req.params.id,
    status: req.body.status,
    remarks: req.body.remarks
  });
  res.json({ request });
};

export const downloadDocumentRequest = async (req, res) => {
  const pdfBuffer = await buildDocumentPdf({
    requester: req.user,
    requestId: req.params.id
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"bibliotek-x-document.pdf\"");
  res.send(pdfBuffer);
};

export const getHostelPasses = async (req, res) => {
  const passes = await getHostelPassOverview(req.user);
  res.json(passes);
};

export const getTransportPasses = async (req, res) => {
  const passes = await getTransportPassOverview(req.user);
  res.json(passes);
};

export const getPlacements = async (req, res) => {
  const placements = await getPlacementOverview(req.user);
  res.json(placements);
};

export const getInternships = async (req, res) => {
  const internships = await getInternshipOverview(req.user);
  res.json(internships);
};

export const getLibraryRecords = async (req, res) => {
  const records = await getLibraryOverview(req.user);
  res.json(records);
};

export const postLeave = async (req, res) => {
  const leave = await createLeave({ user: req.user, payload: req.body });
  res.status(201).json({ leave });
};

export const patchLeave = async (req, res) => {
  const leave = await reviewLeave({
    id: req.params.id,
    reviewer: req.user,
    status: req.body.status,
    reviewNote: req.body.reviewNote
  });
  res.json({ leave });
};

export const downloadReportCard = async (req, res) => {
  const pdfBuffer = await buildReportCardPdf({
    requester: req.user,
    studentId: req.query.studentId || null
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"bibliotek-x-report-card.pdf\"");
  res.send(pdfBuffer);
};

export const downloadHallTicket = async (req, res) => {
  const pdfBuffer = await buildHallTicketPdf({
    requester: req.user,
    examId: req.params.id
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"bibliotek-x-hall-ticket.pdf\"");
  res.send(pdfBuffer);
};

export const downloadResultSheet = async (req, res) => {
  const pdfBuffer = await buildResultSheetPdf({
    requester: req.user,
    resultId: req.params.id
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=\"bibliotek-x-result-sheet.pdf\"");
  res.send(pdfBuffer);
};
