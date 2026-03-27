import { Router } from "express";

import {
  downloadHallTicket,
  downloadFeeReceipt,
  downloadDocumentRequest,
  downloadReportCard,
  downloadResultSheet,
  downloadSeatAllotment,
  getDocumentRequests,
  getExams,
  getFees,
  getGuardianMeetings,
  getGrades,
  getHostelPasses,
  getInternships,
  getLibraryRecords,
  getLeaves,
  getPlacements,
  getPortal,
  getResults,
  getTransportPasses,
  patchLeave,
  patchDocumentRequest,
  postFeePayment,
  postDocumentRequest,
  postGuardianMeeting,
  postLeave
} from "../controllers/portal.controller.js";
import { ROLES } from "../constants/roles.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

export const portalRouter = Router();

portalRouter.get("/", authenticate, asyncHandler(getPortal));
portalRouter.get("/grades", authenticate, asyncHandler(getGrades));
portalRouter.get("/results", authenticate, asyncHandler(getResults));
portalRouter.get("/exams", authenticate, asyncHandler(getExams));
portalRouter.get("/exams/:id/seat-allotment.pdf", authenticate, asyncHandler(downloadSeatAllotment));
portalRouter.get("/fees", authenticate, asyncHandler(getFees));
portalRouter.post("/fees/:id/pay", authenticate, asyncHandler(postFeePayment));
portalRouter.get("/fees/:id/receipt.pdf", authenticate, asyncHandler(downloadFeeReceipt));
portalRouter.get("/leaves", authenticate, asyncHandler(getLeaves));
portalRouter.get("/meetings", authenticate, asyncHandler(getGuardianMeetings));
portalRouter.post("/meetings", authenticate, authorize(ROLES.TEACHER, ROLES.ADMIN), asyncHandler(postGuardianMeeting));
portalRouter.get("/documents", authenticate, asyncHandler(getDocumentRequests));
portalRouter.post("/documents", authenticate, authorize(ROLES.STUDENT), asyncHandler(postDocumentRequest));
portalRouter.patch("/documents/:id", authenticate, authorize(ROLES.TEACHER, ROLES.ADMIN), asyncHandler(patchDocumentRequest));
portalRouter.get("/documents/:id/file.pdf", authenticate, asyncHandler(downloadDocumentRequest));
portalRouter.get("/hostel", authenticate, asyncHandler(getHostelPasses));
portalRouter.get("/transport", authenticate, asyncHandler(getTransportPasses));
portalRouter.get("/placements", authenticate, asyncHandler(getPlacements));
portalRouter.get("/internships", authenticate, asyncHandler(getInternships));
portalRouter.get("/library", authenticate, asyncHandler(getLibraryRecords));
portalRouter.post("/leaves", authenticate, authorize(ROLES.STUDENT), asyncHandler(postLeave));
portalRouter.patch("/leaves/:id", authenticate, authorize(ROLES.TEACHER, ROLES.ADMIN), asyncHandler(patchLeave));
portalRouter.get("/exams/:id/hall-ticket.pdf", authenticate, asyncHandler(downloadHallTicket));
portalRouter.get("/results/:id/result-sheet.pdf", authenticate, asyncHandler(downloadResultSheet));
portalRouter.get("/report-card.pdf", authenticate, asyncHandler(downloadReportCard));
