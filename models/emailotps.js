import mongoose, { Schema } from "mongoose";

const emailOtpSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  otp: { type: Number, required: true },

  createdAt: { type: Date, required: true, default: Date.now, expires: 3600 },
});

const EmailOtps = mongoose.model("emailotps", emailOtpSchema);

export default EmailOtps;
