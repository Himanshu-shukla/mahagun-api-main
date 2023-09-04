import express from "express";
import {
  GetAllMarketingCommunications,
  GetTowerNamesByProperty,
  SendMarketingCommunication,
} from "../controller/marketing.js";
import authAdmin from "../middleware/authAdmin.js";

const marketingRouter = express.Router();

// @route   GET /marketing/all
// @desc    Get all marketing communications
// @access  Private
marketingRouter.get("/all", authAdmin, GetAllMarketingCommunications);

// @route   POST /marketing/send
// @desc    Send a marketing communication
// @access  Private
// @fields  mediums: {whatsapp, email, inapp}, audience, mailData, propertytype, flattype, mailSubject, notifData, purchaseStartDate, purchaseEndDate, attachments, towerType
marketingRouter.post("/send", authAdmin, SendMarketingCommunication);

// @route   POST /marketing/towers-by-property
// @desc    Get towers by property names
// @access  Private
// @fields  properties
marketingRouter.post("/towers-by-property", authAdmin, GetTowerNamesByProperty);

export default marketingRouter;
