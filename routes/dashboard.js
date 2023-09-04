import express from "express";
import { GetAdminDashboardStats } from "../controller/dashboard.js";
import authAdmin from "../middleware/authAdmin.js";

const dashboardRouter = express.Router();

// @route   GET /dashboard/stat
// @desc    Get admin dashboard stats
// @access  Private
dashboardRouter.get("/stat", authAdmin, GetAdminDashboardStats);

export default dashboardRouter;
