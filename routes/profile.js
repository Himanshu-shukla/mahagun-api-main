import express from "express";
import {
  GetAwsUploadToken,
  GetBankingInfo,
  GetCustomerDetailsAdmin,
  GetCustomerProfileStatus,
  GetPersonalInfo,
  GetPropertyInfo,
  SaveBankingInfo,
  SavePersonalInfo,
  SavePropertyInfo,
  UpdateBankingInfo,
  UpdatePersonalInfo,
  UpdatePropertyInfo,
} from "../controller/profile.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import validate from "../middleware/validator.js";
import {
  bankInfoValidationRules,
  personalInfoValidationRules,
  propertyInfoValidationRules,
} from "../validations/profile.js";

const profileRouter = express.Router();

// @route   GET /profile/status
// @desc    Get profile status
// @access  Private
profileRouter.get("/status", auth, GetCustomerProfileStatus);

// @route   GET /profile/personalinfo
// @desc    GET personal information
// @access  Private
profileRouter.get("/personalinfo", auth, GetPersonalInfo);

// @route   POST /profile/personalinfo
// @desc    Save personal information
// @access  Private
// @fields  name, pa, paCity, paState, paPincode, ca, caCity, caState, caPincode, photoIdProof,   profession, alternatePhone, phone, email
profileRouter.post(
  "/personalinfo",
  [auth, personalInfoValidationRules],
  validate,
  SavePersonalInfo
);

// @route   PUT /profile/personalinfo
// @desc    Update personal information
// @access  Private
// @fields  name, pa, paCity, paState, paPincode, ca, caCity, caState, caPincode, photoIdProof,   profession, alternatePhone, phone, email
profileRouter.put(
  "/personalinfo",
  [auth, personalInfoValidationRules],
  validate,
  UpdatePersonalInfo
);

// @route   GET /profile/bankinfo
// @desc    GET banking information
// @access  Private
profileRouter.get("/bankinfo", auth, GetBankingInfo);

// @route   POST /profile/bankinfo
// @desc    Save banking information
// @access  Private
// @fields  accountNumber, accountName, ifsc, accountType, upiId, gstNumber, companyAddress
profileRouter.post(
  "/bankinfo",
  [auth, bankInfoValidationRules],
  validate,
  SaveBankingInfo
);

// @route   PUT /profile/bankinfo
// @desc    Update banking information
// @access  Private
// @fields  accountNumber, accountName, ifsc, accountType, upiId, gstNumber, companyAddress
profileRouter.put(
  "/bankinfo",
  [auth, bankInfoValidationRules],
  validate,
  UpdateBankingInfo
);

// @route   GET /profile/propertyinfo
// @desc    GET property information
// @access  Private
profileRouter.get("/propertyinfo", auth, GetPropertyInfo);

// @route   POST /profile/propertyinfo
// @desc    Save property information
// @access  Private
// @fields  projectName, propertyCode, tower, towerCode, wingUnitNo, propertyType, purchaseDate
profileRouter.post(
  "/propertyinfo",
  [auth, propertyInfoValidationRules],
  validate,
  SavePropertyInfo
);

// @route   PUT /profile/propertyinfo
// @desc    Update property information
// @access  Private
// @fields  projectName, propertyCode, tower, towerCode, wingUnitNo, propertyType, purchaseDate
profileRouter.put(
  "/propertyinfo",
  [auth, propertyInfoValidationRules],
  validate,
  UpdatePropertyInfo
);

// @route   GET /profile/uploadtoken
// @desc    GET AWS upload token
// @access  Private
profileRouter.get("/uploadtoken", auth, GetAwsUploadToken);

// @route   GET /profile/customerdetails/:customerId
// @desc    GET complete customer details admin
// @access  Private
profileRouter.get(
  "/customerdetails/:customerId",
  authAdmin,
  GetCustomerDetailsAdmin
);

export default profileRouter;
