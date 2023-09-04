import express from "express";
import {
  ChangeAcceptedStatus,
  GetAdminCustomizations,
  GetCustomerCustomizations,
  GetSingleCustomerCustomizationsAdmin,
  SaveCustomerCustomizations,
  UpdateCustomerCustomizations,
} from "../controller/customizations.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import {
  customizationAcceptRules,
  customizationGetRules,
  customizationSaveRules,
  customizationUpdateRules,
} from "../validations/customizations.js";

const customizationsRouter = express.Router();

// @route   POST /customizations/list
// @desc    Get all customizations
// @access  Private
// @fields  customerId
customizationsRouter.post("/list", authAdmin, GetAdminCustomizations);

// @route   POST /customizations/single-customer
// @desc    Get a single customer's customization data
// @access  Private
// @fields  customerId, propertyId
customizationsRouter.post(
  "/single-customer",
  authAdmin,
  GetSingleCustomerCustomizationsAdmin
);

// @route   POST /customizations/save
// @desc    Save a new customization
// @access  Private
// @fields  customizationData, customerId, propertyId
customizationsRouter.post(
  "/save",
  [auth, customizationSaveRules],
  SaveCustomerCustomizations
);

// @route   PUT /customizations/save
// @desc    Update a saved customization
// @access  Private
// @fields  cid, categoryName, selectedName, selectedImages, selectedValues, upgrade, selectedTypes
customizationsRouter.put(
  "/save",
  [auth, customizationUpdateRules],
  UpdateCustomerCustomizations
);

// @route   POST /customizations/all
// @desc    Update a saved customization
// @access  Private
// @fields  propertyId
customizationsRouter.post(
  "/all",
  [auth, customizationGetRules],
  GetCustomerCustomizations
);

// @route   POST /customizations/accept
// @desc    Accept a customization
// @access  Private
// @fields  propertyId, upgrades
customizationsRouter.post(
  "/accept",
  [auth, customizationAcceptRules],
  ChangeAcceptedStatus
);

export default customizationsRouter;
