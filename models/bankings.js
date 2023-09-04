import mongoose, { Schema } from "mongoose";

const bankingSchema = new mongoose.Schema({
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

  updatedAt: { type: Date, required: true, default: Date.now },
});

const Bankings = mongoose.model("bankings", bankingSchema);

export default Bankings;
