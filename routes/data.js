import express from "express";
import {
  GetBookletByPropertyId,
  GetAllProjectsList,
  GetAllTicketTypes,
  GetPropertyInfo,
} from "../controller/data.js";
import auth from "../middleware/auth.js";

const dataRouter = express.Router();

// @route   GET /data/projects
// @desc    Get all projects list
// @access  Public
dataRouter.get("/projects", GetAllProjectsList);

// @route   GET /data/tickettypes
// @desc    Get all ticket types
// @access  Private
dataRouter.get("/tickettypes", auth, GetAllTicketTypes);

// @route   POST /data/booklet
// @desc    Get booklet by propertyId
// @access  Private
// @fields  propertyId
dataRouter.post("/booklet", auth, GetBookletByPropertyId);

// @route   GET /data/propertyinfo
// @desc    Get property data (to fill property info)
// @access  Private
dataRouter.get("/propertyinfo", auth, GetPropertyInfo);

export default dataRouter;
