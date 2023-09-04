import mongoose, { Schema } from "mongoose";

const customerStatusSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  personalInfoFilled: { type: Boolean, default: false },

  bankingInfoFilled: { type: Boolean, default: false },

  projectInfoFilled: { type: Boolean, default: false },

  //can be 'DRAFT', 'APPROVED', 'UNDER_REVIEW'
  status: { type: String, default: "DRAFT" },

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const CustomerStatus = mongoose.model("customerStatus", customerStatusSchema);

export default CustomerStatus;
