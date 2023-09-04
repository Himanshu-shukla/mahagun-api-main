import mongoose, { Schema } from "mongoose";

const customizationDetailSchema = new mongoose.Schema({
  categoryName: String,

  selectedName: String,

  customerId: { type: Schema.Types.ObjectId, ref: "customers" },

  propertyId: { type: Schema.Types.ObjectId, ref: "properties" },

  selectedImages: [{ label: String, imageUrl: String }],

  selectedValues: [
    {
      label: String,
      images: [{ label: String, imageUrl: String }],
      upgrade: { label: String, price: String },
    },
  ],

  upgrade: { label: String, price: String },

  selectedTypes: [
    {
      label: String,
      choice1: String,
      choice2: String,
      choice3: String,
    },
  ],

  accepted: { type: Boolean, default: false },

  upgrades: { type: Boolean, default: false },

  createdAt: { type: Date, required: true, default: Date.now },

  updatedAt: { type: Date, required: true, default: Date.now },
});

const CustomizationDetails = mongoose.model(
  "customizationdetails",
  customizationDetailSchema
);

export default CustomizationDetails;
