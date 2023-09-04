import mongoose, { Schema } from "mongoose";

const personalInfoRequestSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  email: String,

  phone: Number,

  name: String,

  alternatePhone: Number,

  //Permanent address
  pa: String,

  paCity: String,

  paState: String,

  paPincode: String,

  //Current address
  ca: String,

  caCity: String,

  caState: String,

  caPincode: String,

  photoIdProof: {
    docType: String,
    url: String,
  },

  profession: String,

  dob: Date,

  //can be 'APPROVED', 'REJECTED', 'UNDER_REVIEW', "ORIGNAL"
  status: { type: String, default: "UNDER_REVIEW" },

  createdAt: { type: Date, required: true, default: Date.now },
});

const PersonalInfoRequests = mongoose.model(
  "personalinforequests",
  personalInfoRequestSchema
);

export default PersonalInfoRequests;
