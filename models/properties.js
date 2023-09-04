import mongoose, { Schema } from "mongoose";

const propertySchema = new mongoose.Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  // can be a. Mezzaria, b. Meeadow, c. Manorialle & d. Medalleo
  projectName: String,

  propertyCode: String,

  tower: String,

  towerCode: String,

  wingUnitNo: Number,

  propertyType: String,

  purchaseDate: { type: Date },

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const Properties = mongoose.model("properties", propertySchema);

export default Properties;
