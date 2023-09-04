import express from "express";
import {
  AddNewAdminComment,
  AddNewCustomerComment,
  AddNewTicket,
  AssignTicketOnAdmin,
  CloseTicketAdmin,
  GetAdminTicketsByStatus,
  GetAllAdminComment,
  GetAllCustomerComment,
  GetCustomerTicketsByStatus,
  UpdateTicketEtrAdmin,
} from "../controller/tickets.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import validate from "../middleware/validator.js";
import {
  newCommentValidationRules,
  newTicketsValidationRules,
  ticketAssignmentRules,
  ticketCloseRules,
  ticketEtrRules,
} from "../validations/tickets.js";

const ticketsRouter = express.Router();

// @route   GET /tickets/status/:status
// @desc    Get tickets by status
// @access  Private
ticketsRouter.get("/status/:status", auth, GetCustomerTicketsByStatus);

// @route   POST /tickets/admin/status
// @desc    Get admin tickets by status
// @access  Private
// @fields  status, ticketId
ticketsRouter.post("/admin/status", authAdmin, GetAdminTicketsByStatus);

// @route   POST /tickets/add
// @desc    Add new ticket
// @access  Private
// @fields  title, message, issueType
ticketsRouter.post(
  "/add",
  [auth, newTicketsValidationRules],
  validate,
  AddNewTicket
);

// @route   GET /tickets/comment/customer/:ticketId
// @desc    Get all comments by ticketId
// @access  Private
ticketsRouter.get("/comment/customer/:ticketId", auth, GetAllCustomerComment);

// @route   POST /tickets/comment/customer
// @desc    Add new comment on ticket
// @access  Private
// @fields  ticketId, comment
ticketsRouter.post(
  "/comment/customer",
  [auth, newCommentValidationRules],
  validate,
  AddNewCustomerComment
);

// @route   GET /tickets/comment/admin/:ticketId
// @desc    Get all comments by ticketId for admin
// @access  Private
ticketsRouter.get("/comment/admin/:ticketId", authAdmin, GetAllAdminComment);

// @route   POST /tickets/comment/admin
// @desc    Add new comment on ticket for admin
// @access  Private
// @fields  ticketId, comment
ticketsRouter.post(
  "/comment/admin",
  [authAdmin, newCommentValidationRules],
  validate,
  AddNewAdminComment
);

// @route   POST /tickets/assign
// @desc    Assign ticket on admin
// @access  Private
// @fields  assignTo, ticketId, assignedName
ticketsRouter.post(
  "/assign",
  [authAdmin, ticketAssignmentRules],
  validate,
  AssignTicketOnAdmin
);

// @route   POST /tickets/etr
// @desc    Update ETR by ticketId
// @access  Private
// @fields  etr, ticketId
ticketsRouter.post(
  "/etr",
  [authAdmin, ticketEtrRules],
  validate,
  UpdateTicketEtrAdmin
);

// @route   POST /tickets/close
// @desc    Close ticket by ticketId
// @access  Private
// @fields  resolutionNote, ticketId
ticketsRouter.post(
  "/close",
  [authAdmin, ticketCloseRules],
  validate,
  CloseTicketAdmin
);

export default ticketsRouter;
