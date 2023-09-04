import mongoose, { Schema } from "mongoose";

const propertyInfoRequestSchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  // can be a. Mezzaria, b. Meeadow, c. Manorialle & d. Medalleo
  projectName: String,

  propertyCode: String,

  tower: String,

  towerCode: String,

  propertyType: String,

  wingUnitNo: Number,

  purchaseDate: Date,

  createdAt: { type: Date, required: true, default: Date.now },

  //can be 'APPROVED', 'REJECTED', 'UNDER_REVIEW', "ORIGNAL"
  status: { type: String, default: "UNDER_REVIEW" },
});

const PropertyInfoRequests = mongoose.model(
  "propertyinforequests",
  propertyInfoRequestSchema
);

export default PropertyInfoRequests;
