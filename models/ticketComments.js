import mongoose, { Schema } from "mongoose";

const ticketCommentSchema = new mongoose.Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: "tickets" },

  comment: String,

  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  adminId: { type: Schema.Types.ObjectId, ref: "admins" },

  name: String,

  createdAt: { type: Date, required: true, default: Date.now },

  // can be comment, log
  type: String,
});

const TicketComments = mongoose.model("ticketcomments", ticketCommentSchema);

export default TicketComments;
