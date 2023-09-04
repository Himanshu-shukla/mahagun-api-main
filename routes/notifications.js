import express from "express";
import {
  GetAllAdminNotifications,
  GetAllCustomerNotifications,
  MarkSingleNotificationRead,
} from "../controller/notifications.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const notificationsRouter = express.Router();

// @route   GET /notifications/admin/:period
// @desc    Get all admin notifications
// @access  Private
notificationsRouter.get("/admin/:period", authAdmin, GetAllAdminNotifications);

// @route   GET /notifications/markread/:id
// @desc    Mark a single notification as read (admin)
// @access  Private
notificationsRouter.get("/markread/:id", authAdmin, MarkSingleNotificationRead);

// @route   GET /notifications/c/markread/:id
// @desc    Mark a single notification as read (customer)
// @access  Private
notificationsRouter.get("/c/markread/:id", auth, MarkSingleNotificationRead);

// @route   GET /notifications/customer/:period
// @desc    Get all customer notifications
// @access  Private
notificationsRouter.get("/customer/:period", auth, GetAllCustomerNotifications);

export default notificationsRouter;
