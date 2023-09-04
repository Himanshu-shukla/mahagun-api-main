import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: String,

  phone: Number,

  password: String,

  blocked: { type: Boolean, default: false },

  name: String,

  alternatePhone: Number,

  role: { type: String, default: "admin" },

  profilePic: String,

  requirePasswordChange: { type: Boolean, default: false },

  mfaEnabled: { type: Boolean, default: false },

  mfaSecret: String,

  features: [{ type: String }],

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const Admins = mongoose.model("admins", adminSchema);

export default Admins;
