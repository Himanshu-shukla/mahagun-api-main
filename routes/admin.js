import express from "express";
import {
  CreatePassowrdHash,
  GetAllAdminList,
  LoginWithPassword,
} from "../controller/admin.js";
import { passowrdLimiter } from "../helpers/rateLimiter.js";
import authAdmin from "../middleware/authAdmin.js";
import validate from "../middleware/validator.js";
import { adminLoginValidationRules } from "../validations/admin.js";

const adminRouter = express.Router();

// @route   POST /admin/login
// @desc    Login admin In Mahagun web
// @access  Public
// @fields  email, password
adminRouter.post(
  "/login",
  [adminLoginValidationRules, passowrdLimiter],
  validate,
  LoginWithPassword
);

// @route   GET /admin/list
// @desc    Get all admin _id and name
// @access  Private
adminRouter.get("/list", authAdmin, GetAllAdminList);

// @route   GET /admin/passwordhash/:password
// @desc    Convert passowrd into hash
// @access  Private
adminRouter.get("/passwordhash/:password", CreatePassowrdHash);

export default adminRouter;
