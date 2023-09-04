import express from "express";
import {
  SendLoginOTP,
  VerifyLoginOTP,
  SaveInquiryDetails,
  RetryLoginOTP,
} from "../controller/customer.js";
import { inquiryLimiter, otpLimiter } from "../helpers/rateLimiter.js";
import validate from "../middleware/validator.js";
import {
  inquiryValidationRules,
  loginValidationRules,
  otpValidationRules,
} from "../validations/customer.js";

const customerRouter = express.Router();

// @route   POST /customer/login
// @desc    Login In Mahagun App
// @access  Public
// @fields  type, value
customerRouter.post(
  "/login",
  [loginValidationRules, otpLimiter],
  validate,
  SendLoginOTP
);

// @route   POST /customer/verifyotp
// @desc    Verify login/register OTP
// @access  Public
// @fields  type, otp, value
customerRouter.post(
  "/verifyotp",
  [otpValidationRules, otpLimiter],
  validate,
  VerifyLoginOTP
);

// @route   POST /customer/retryotp
// @desc    Retry login/register OTP
// @access  Public
// @fields  type, value
customerRouter.post(
  "/retryotp",
  [loginValidationRules, otpLimiter],
  validate,
  RetryLoginOTP
);

// @route   POST /customer/inquiry
// @desc    Save new customer inquiry
// @access  Public
// @fields  name, phone, email, project, message
customerRouter.post(
  "/inquiry",
  [inquiryValidationRules, inquiryLimiter],
  validate,
  SaveInquiryDetails
);

export default customerRouter;
