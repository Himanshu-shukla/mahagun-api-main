import { check } from "express-validator";
import { ticketTypesArr } from "../data/ticketType.js";

const newTicketsValidationRules = [
  check("title").notEmpty().withMessage("Ticket title is mendatory"),

  check("message").notEmpty().withMessage("Ticket message is mendatory"),

  check("issueType")
    .notEmpty()
    .withMessage("Issue type is mendatory")
    .isIn(ticketTypesArr)
    .withMessage("Invalid issue type"),
];

const newCommentValidationRules = [
  check("ticketId").notEmpty().withMessage("Ticket Id is mendatory"),

  check("comment").notEmpty().withMessage("Comment text is mendatory"),
];

const ticketAssignmentRules = [
  check("ticketId").notEmpty().withMessage("Ticket Id is mendatory"),

  check("assignTo").notEmpty().withMessage("Comment text is mendatory"),
];

const ticketEtrRules = [
  check("ticketId").notEmpty().withMessage("Ticket Id is mendatory"),

  check("etr").notEmpty().withMessage("ETR is mendatory"),
];

const ticketCloseRules = [
  check("ticketId").notEmpty().withMessage("Ticket Id is mendatory"),

  check("resolutionNote")
    .notEmpty()
    .withMessage("Resolution note is mendatory"),
];

export {
  newTicketsValidationRules,
  newCommentValidationRules,
  ticketAssignmentRules,
  ticketEtrRules,
  ticketCloseRules,
};
