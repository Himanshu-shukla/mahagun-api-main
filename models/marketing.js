import mongoose, { Schema } from "mongoose";

const marketingSchema = new mongoose.Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "admins" },

  mediums: {
    whatsapp: Boolean,

    email: Boolean,

    inapp: Boolean,
  },

  audience: String,

  mailData: String,

  propertytype: [{ type: String }],

  flattype: [{ type: String }],

  towers: [{ type: String }],

  mailSubject: String,

  notifData: String,

  purchaseStartDate: Date,

  purchaseEndDate: Date,

  attachments: [{ name: String, fileType: String, url: String }],

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const Marketings = mongoose.model("marketings", marketingSchema);

export default Marketings;
