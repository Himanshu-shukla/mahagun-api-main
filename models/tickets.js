import mongoose, { Schema } from "mongoose";

const ticketSchema = new mongoose.Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "customers" },

  closedAt: Date,

  closedBy: { type: Schema.Types.ObjectId, ref: "admins" },

  status: String,

  title: String,

  message: String,

  assignedTo: { type: Schema.Types.ObjectId, ref: "admins" },

  etr: Date,

  assignedBy: { type: Schema.Types.ObjectId, ref: "admins" },

  issueType: String,

  priority: String,

  caseNo: String,

  resolutionNote: String,

  code: String,

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const Tickets = mongoose.model("tickets", ticketSchema);

export default Tickets;
