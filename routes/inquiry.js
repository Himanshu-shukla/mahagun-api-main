import express from "express";
import { GetAllAdminInquiries } from "../controller/inquiry.js";
import authAdmin from "../middleware/authAdmin.js";

const inquiryRouter = express.Router();

// @route   POST /inquiry/admin/all
// @desc    Get all inquiries on admin
// @access  Private
// @fields  _id
inquiryRouter.post("/admin/all", authAdmin, GetAllAdminInquiries);

export default inquiryRouter;
