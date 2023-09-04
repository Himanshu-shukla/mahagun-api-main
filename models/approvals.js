import mongoose, { Schema } from "mongoose";

const approvalSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  name: String,

  email: String,

  phone: String,

  //can be 'PENDING', 'APPROVED', 'REJECTED'
  status: { type: String, default: "PENDING" },

  //can be 'MID', 'PROPERTY', 'BANK', "PERSONAL"
  type: String,

  rejectionNote: String,

  createdAt: { type: Date, required: true, default: Date.now },
});

const Approvals = mongoose.model("approvals", approvalSchema);

export default Approvals;
