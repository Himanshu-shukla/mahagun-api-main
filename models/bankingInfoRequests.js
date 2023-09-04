import mongoose, { Schema } from "mongoose";

const bankingInfoRequestSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  accountNumber: String,

  accountName: String,

  ifsc: String,

  // Can be current / saving
  accountType: String,

  upiId: String,

  gstNumber: String,

  companyAddress: String,

  createdAt: { type: Date, required: true, default: Date.now },

  //can be 'APPROVED', 'REJECTED', 'UNDER_REVIEW', "ORIGNAL"
  status: { type: String, default: "UNDER_REVIEW" },
});

const BankingInfoRequests = mongoose.model(
  "bankinginforequests",
  bankingInfoRequestSchema
);

export default BankingInfoRequests;
