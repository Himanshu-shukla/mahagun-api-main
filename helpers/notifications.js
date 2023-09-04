import moment from "moment";
import Admins from "../models/admins.js";
import Customers from "../models/customers.js";
import Notifications from "../models/notifications.js";
import { GetMarketingAttachmentUrl } from "./cdn.js";

const SendNewTicketNotification = async (customerId, issueType, caseNo) => {
  const customer = await Customers.findById(customerId)
    .select("name mid")
    .lean();

  await Notifications.create({
    audience: "admin",
    title: `${customer.name ?? "customer"} (MID: ${
      customer.mid
    }) has raised an ticket (no. ${caseNo}) on type: ${issueType}`,
    category: "Tickets",
    subCategory: "new ticket",
    actionName: "View ticket",
    actionLink: "/tickets?tab=unassigned",
  });
};

const SendNewCommentNotificationAdmin = async (customer, ticket) => {
  await Notifications.create({
    audience: "single",
    adminId: ticket.assignedTo,
    title: `${customer.name ?? "customer"} (MID: ${
      customer.mid
    }) added a new comment on ticket (no. ${ticket.caseNo})`,
    category: "Tickets",
    subCategory: "new comment",
    actionName: "View comment",
    actionLink: `/tickets?tab=pending&ticket=${ticket._id}`,
  });
};

const SendNewCommentNotificationCustomer = async (adminName, ticket) => {
  await Notifications.create({
    audience: "single",
    customerId: ticket.createdBy,
    title: `New comment on your ticket (no. ${ticket.caseNo}) by ${adminName}`,
    category: "Tickets",
    subCategory: "new comment",
    actionName: "View comment",
    actionLinkApp: `Chat$${ticket._id}`,
  });
};

const SendEtrUpdateNotificationCustomer = async (
  adminName,
  ticket,
  etrString
) => {
  await Notifications.create({
    audience: "single",
    customerId: ticket.createdBy,
    title: `${adminName} update the ETR(Estimated Time of Resolution) of your ticket (no. ${ticket.caseNo}) to ${etrString}`,
    category: "Tickets",
    subCategory: "ETR update",
    actionName: "Check updates",
    actionLinkApp: `Chat$${ticket._id}`,
  });
};

const SendClosureNotificationCustomer = async (adminName, ticket) => {
  await Notifications.create({
    audience: "single",
    customerId: ticket.createdBy,
    title: `Your ticket (no. ${ticket.caseNo}) is mark resolved and closed by ${adminName}`,
    category: "Tickets",
    subCategory: "Ticket closure",
    actionName: "View resolution note",
    actionLinkApp: `Chat$${ticket._id}`,
  });
};

const SendAssignmentNotificationBoth = async (
  adminName,
  ticket,
  assignedName,
  assignToId,
  adminId
) => {
  if (assignToId.toString() !== adminId.toString())
    await Notifications.create({
      audience: "single",
      adminId: assignToId,
      title: `New ticket (no. ${ticket.caseNo}) assigned by ${adminName}`,
      category: "Tickets",
      subCategory: "Ticket assignment",
      actionName: "View ticket",
      actionLink: `/tickets?tab=pending&ticket=${ticket._id}`,
    });

  await Notifications.create({
    audience: "single",
    customerId: ticket.createdBy,
    title: `Your ticket (no. ${ticket.caseNo}) is assigned to ${assignedName}`,
    category: "Tickets",
    subCategory: "Ticket assignment",
    actionName: "Check updates",
    actionLinkApp: `Chat$${ticket._id}`,
  });
};

const SendRejectionNotifCustomer = async (
  customerId,
  rejectionNote,
  adminName,
  type
) => {
  await Notifications.create({
    audience: "single",
    customerId,
    title: `Your profile approval request is rejected by ${adminName}. Rejection reason: ${rejectionNote}`,
    category: "Approvals",
    subCategory: `${type} rejected`,
    actionName: "Update profile & re-submit",
    actionLinkApp: `Profile$${customerId}`,
  });
};

const SendAcceptNotifCustomer = async (customerId, adminName, type, mid) => {
  await Notifications.create({
    audience: "single",
    customerId,
    title: `Your profile approval request is accepted by ${adminName} and your Mahagun Id (MID) is ${mid}`,
    category: "Approvals",
    subCategory: `${type} approved`,
    actionName: "View profile",
    actionLinkApp: `Profile$${customerId}`,
  });
};

const SendChangesAcceptNotifCustomer = async (customerId, adminName, type) => {
  await Notifications.create({
    audience: "single",
    customerId,
    title: `Your profile changes approval request is accepted by ${adminName}`,
    category: "Approvals",
    subCategory: `${type} approved`,
    actionName: "View profile",
    actionLinkApp: `Profile$${customerId}`,
  });
};

const SendProfileReviewNotifAdmin = async (customerId, customerName) => {
  await Notifications.create({
    audience: "admin",
    title: `A new profile has been submitted for review by ${customerName}`,
    category: "Approvals",
    subCategory: `approval submission`,
    actionName: "View profile",
    actionLink: `/approvals?tab=pending&cid=${customerId}`,
  });
};

const SendNewInquiryNotifAdmin = async (
  customerPhone,
  customerName,
  project,
  inquiryId
) => {
  await Notifications.create({
    audience: "admin",
    title: `A new inquiry has been submitted by ${customerName} (${customerPhone}) on project ${project}`,
    category: "Inquiries",
    subCategory: `New inquiry`,
    actionName: "View details",
    actionLink: `/inquiries?id=${inquiryId}`,
  });
};

const PeriodBasedFilteration = async (period) => {
  if (period === "today")
    return {
      $gte: moment().startOf("day").toDate(),
      $lte: moment().endOf("day").toDate(),
    };

  return {
    $lte: moment().subtract(1, "days").endOf("day").toDate(),
  };
};

const SendMarketingNotification = async (
  customerId,
  title,
  notifAttachments
) => {
  let attachments = [];

  for (const a of notifAttachments) {
    attachments.push({
      name: a.name,
      url: await GetMarketingAttachmentUrl(a.url),
      fileType: a.fileType,
    });
  }

  await Notifications.create({
    audience: "single",
    customerId,
    title,
    category: "Mahagun",
    subCategory: "notification",
    attachments,
  });
};

const SendCustomizationAcceptNotifCustomer = async (customerId, propertyId) => {
  await Notifications.create({
    audience: "single",
    customerId,
    title: `Your have accepted the customization details successfully. All details are sent to the concerned team for further action`,
    category: "Customizations",
    subCategory: `details submitted`,
    actionName: "View Summary",
    actionLinkApp: `Customizations$${customerId}$${propertyId}`,
  });
};

const SendCustomizationNotifAdmin = async (
  customerId,
  propertyId,
  upgrades
) => {
  const cutomer = await Customers.findById(customerId)
    .select("name mid")
    .lean();

  const admins = await Admins.find({ role: upgrades ? "sales" : "" })
    .select("_id")
    .lean();

  admins.forEach(async (admin) => {
    await Notifications.create({
      audience: "single",
      adminId: admin._id,
      title: `New customizations details submitted by ${cutomer.name} (MID: ${cutomer.mid})`,
      category: "Customizations",
      subCategory: `details submitted`,
      actionName: "View Summary",
      actionLink: `/customizations?cid=${customerId}&pid=${propertyId}`,
    });
  });
};

export {
  SendNewTicketNotification,
  PeriodBasedFilteration,
  SendNewCommentNotificationAdmin,
  SendNewCommentNotificationCustomer,
  SendEtrUpdateNotificationCustomer,
  SendClosureNotificationCustomer,
  SendAssignmentNotificationBoth,
  SendRejectionNotifCustomer,
  SendAcceptNotifCustomer,
  SendProfileReviewNotifAdmin,
  SendNewInquiryNotifAdmin,
  SendMarketingNotification,
  SendChangesAcceptNotifCustomer,
  SendCustomizationAcceptNotifCustomer,
  SendCustomizationNotifAdmin,
};
