import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  email: String,

  phone: Number,

  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
  },

  blocked: { type: Boolean, default: false },

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },

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

  profilePic: String,

  dob: Date,

  mid: String,

  //can be 'DRAFT', 'APPROVED', 'UNDER_REVIEW'
  status: { type: String, default: "DRAFT" },

  loginSource: String,
});

const Customers = mongoose.model("customers", customerSchema);

export default Customers;
