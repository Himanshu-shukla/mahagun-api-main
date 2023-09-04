import Tickets from "../models/tickets.js";
import { ticketTypes } from "../data/ticketType.js";
import {
  getAdminTicketStatusMatchQuery,
  getTicketStatusMatchQuery,
} from "../helpers/tickets.js";
import Customers from "../models/customers.js";
import TicketComments from "../models/ticketComments.js";
import moment from "moment";
import {
  SendAssignmentNotificationBoth,
  SendClosureNotificationCustomer,
  SendEtrUpdateNotificationCustomer,
  SendNewCommentNotificationAdmin,
  SendNewCommentNotificationCustomer,
  SendNewTicketNotification,
} from "../helpers/notifications.js";

const GetCustomerTicketsByStatus = async (req, res) => {
  const { status } = req.params;

  const { customer } = req;

  try {
    let matchQuery = await getTicketStatusMatchQuery(status);

    const tickets = await Tickets.find({
      ...matchQuery,
      createdBy: customer._id,
    })
      .select(
        "status title message assignedTo etr issueType priority caseNo resolutionNote closedAt closedBy createdAt"
      )
      .lean();

    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAdminTicketsByStatus = async (req, res) => {
  const { status, ticketId } = req.body;

  const { admin } = req;

  try {
    let matchQuery = await getAdminTicketStatusMatchQuery(status);

    if (status.toLowerCase() !== "unassigned")
      matchQuery = { ...matchQuery, assignedTo: admin._id };

    if (ticketId) matchQuery = { ...matchQuery, _id: ticketId };

    const tickets = await Tickets.find(matchQuery)
      .select(
        "status title message assignedTo etr issueType priority caseNo resolutionNote closedAt closedBy createdAt createdBy"
      )
      .populate("createdBy", "name")
      .lean();

    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const AddNewTicket = async (req, res) => {
  const { title, message, issueType } = req.body;

  const { customer } = req;

  try {
    let { priority, code } = ticketTypes.filter(
      (t) => t.des === issueType.trim()
    )[0];

    if (!priority) priority = "Low";

    if (!code) code = "GEN";

    const count = (await Tickets.countDocuments({ code: { $eq: "GEN" } })) + 1;

    const caseNo = `${code}${count}`;

    await Tickets.create({
      priority,
      code,
      caseNo,
      createdBy: customer._id,
      title: title.trim(),
      status: "UNASSIGNED",
      message: message.trim(),
      issueType: issueType.trim(),
    });

    //TODO: Mail to customer on ticket creation

    SendNewTicketNotification(customer._id, issueType.trim(), caseNo);

    return res.status(200).json("Ticket created successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAllCustomerComment = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Tickets.findById(ticketId).select("caseNo").lean();
    if (!ticket) return res.status(400).json("No ticket found with given Id");

    const comments = await TicketComments.find({
      ticketId,
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const AddNewCustomerComment = async (req, res) => {
  const { ticketId, comment } = req.body;

  const { customer } = req;

  try {
    const ticket = await Tickets.findById(ticketId)
      .select("caseNo assignedTo")
      .lean();
    if (!ticket) return res.status(400).json("No ticket found with given Id");

    const customerDetails = await Customers.findById(customer._id, {
      blocked: false,
    })
      .select("name mid")
      .lean();
    if (!customerDetails)
      return res.status(400).json("No customer found with given jwt");

    await TicketComments.create({
      ticketId,
      customerId: customer._id,
      comment: comment.trim(),
      name: customerDetails.name ?? "customer",
      type: "comment",
    });

    //TODO: Mail to admin on new comment

    SendNewCommentNotificationAdmin(customerDetails, ticket);

    return res.status(200).json("Comment added successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const GetAllAdminComment = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Tickets.findById(ticketId).select("caseNo").lean();
    if (!ticket) return res.status(400).json("No ticket found with given Id");

    const comments = await TicketComments.find({
      ticketId,
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const AddNewAdminComment = async (req, res) => {
  const { ticketId, comment } = req.body;

  const { admin } = req;

  try {
    const ticket = await Tickets.findById(ticketId)
      .select("caseNo createdBy")
      .lean();
    if (!ticket) return res.status(400).json("No ticket found with given Id");

    await TicketComments.create({
      ticketId,
      adminId: admin._id,
      comment: comment.trim(),
      name: admin.name,
      type: "comment",
    });

    //TODO: Mail to customer on new comment
    //TODO: Push notification to customer on new comment

    SendNewCommentNotificationCustomer(admin.name, ticket);

    return res.status(200).json("Comment added successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const AssignTicketOnAdmin = async (req, res) => {
  let { assignTo, ticketId, assignedName } = req.body;

  const { admin } = req;

  try {
    const ticket = await Tickets.findOne({
      _id: ticketId,
      status: "UNASSIGNED",
    })
      .select("caseNo createdBy")
      .lean();
    if (!ticket)
      return res.status(400).json("No unassigned ticket found with given Id");

    if (assignTo === "self") assignTo = admin._id;

    await Tickets.findByIdAndUpdate(ticketId, {
      $set: {
        status: "ASSIGNED",
        assignedTo: assignTo,
        assignedBy: admin._id,
        updatedAt: Date.now(),
      },
    });

    await TicketComments.create({
      ticketId,
      adminId: admin._id,
      comment: `${admin.name} assigned this ticket to ${assignedName}`,
      name: admin.name,
      type: "log",
    });

    //TODO: Mail to customer, admin on assignment
    //TODO: Push notification to customer on assignment

    SendAssignmentNotificationBoth(
      admin.name.trim(),
      ticket,
      assignedName.trim(),
      assignTo,
      admin._id
    );

    return res.status(200).json("Ticket assigned successfully");
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const UpdateTicketEtrAdmin = async (req, res) => {
  let { etr, ticketId } = req.body;

  const { admin } = req;

  try {
    const ticket = await Tickets.findById(ticketId)
      .select("etr createdBy caseNo")
      .lean();
    if (!ticket) return res.status(400).json("No ticket found with given Id");

    await Tickets.findByIdAndUpdate(ticketId, {
      $set: {
        etr: moment(etr).endOf("day").toDate(),
        updatedAt: Date.now(),
      },
    });

    const etrString = moment(etr).format("ll");

    await TicketComments.create({
      ticketId,
      adminId: admin._id,
      comment: `${admin.name} updated ETR to ${etrString}`,
      name: admin.name,
      type: "log",
    });

    //TODO: Mail to customer on ETR update
    //TODO: Push notification to customer on ETR update

    SendEtrUpdateNotificationCustomer(admin.name, ticket, etrString);

    return res.status(200).json(`ETR successfully updated to ${etrString}`);
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

const CloseTicketAdmin = async (req, res) => {
  let { resolutionNote, ticketId } = req.body;

  const { admin } = req;

  try {
    const ticket = await Tickets.findById(ticketId)
      .select("caseNo createdBy")
      .lean();
    if (!ticket)
      return res.status(400).json("No open ticket found with given Id");

    await Tickets.findByIdAndUpdate(ticketId, {
      $set: {
        resolutionNote: resolutionNote.trim(),
        closedAt: Date.now(),
        closedBy: admin._id,
        status: "CLOSED",
        updatedAt: Date.now(),
      },
    });

    await TicketComments.create({
      ticketId,
      adminId: admin._id,
      comment: `${admin.name} closed the ticket`,
      name: admin.name,
      type: "log",
    });

    await TicketComments.create({
      ticketId,
      adminId: admin._id,
      comment: "[Resolution note] " + resolutionNote.trim(),
      name: admin.name,
      type: "comment",
    });

    //TODO: Mail to customer on closure
    //TODO: Push notification to customer on closure

    SendClosureNotificationCustomer(admin.name, ticket);

    return res
      .status(200)
      .json(`Ticket no. ${ticket.caseNo} closed successfully`);
  } catch (error) {
    return res.status(500).json(`error: ${error}`);
  }
};

export {
  AddNewTicket,
  GetCustomerTicketsByStatus,
  GetAdminTicketsByStatus,
  AddNewCustomerComment,
  AddNewAdminComment,
  GetAllCustomerComment,
  GetAllAdminComment,
  AssignTicketOnAdmin,
  UpdateTicketEtrAdmin,
  CloseTicketAdmin,
};
