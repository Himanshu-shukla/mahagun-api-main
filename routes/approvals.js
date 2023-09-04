import express from "express";
import {
  ApproveCustomerProfile,
  GetAdminApprovalsByStatus,
  GetChangeDataDetails,
  RejectCustomerProfile,
} from "../controller/approvals.js";
import authAdmin from "../middleware/authAdmin.js";

const approvalsRouter = express.Router();

// @route   POST /approvals/list
// @desc    Get all approvals by status
// @access  Private
// @fields  status, customerId
approvalsRouter.post("/list", authAdmin, GetAdminApprovalsByStatus);

// @route   POST /approvals/reject
// @desc    Reject a profile Under Review
// @access  Private
// @fields  customerId, rejectionNote
approvalsRouter.post("/reject", authAdmin, RejectCustomerProfile);

// @route   GET /approvals/approve/:customerId
// @desc    Approve a profile Under Review & generate MID
// @access  Private
approvalsRouter.get("/approve/:customerId", authAdmin, ApproveCustomerProfile);

// @route   POST /approvals/changedata
// @desc    Get change data object
// @access  Private
// @fields  type, customerId
approvalsRouter.post("/changedata", authAdmin, GetChangeDataDetails);

export default approvalsRouter;
