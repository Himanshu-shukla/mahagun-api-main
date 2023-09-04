import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: String,

  email: String,

  phone: Number,

  project: String,

  message: String,

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const Inquires = mongoose.model("inquires", inquirySchema);

export default Inquires;
