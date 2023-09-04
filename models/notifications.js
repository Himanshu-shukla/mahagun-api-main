import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  adminId: { type: Schema.Types.ObjectId, ref: "admins" },

  audience: String,

  title: String,

  category: String,

  subCategory: String,

  actionName: String,

  actionLink: String,

  actionLinkApp: String,

  isUnread: { type: Boolean, default: true },

  readAt: Date,

  attachments: [{ name: String, fileType: String, url: String }],

  createdAt: { type: Date, required: true, default: Date.now },
});

const Notifications = mongoose.model("notifications", notificationSchema);

export default Notifications;
