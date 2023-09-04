import mongoose, { Schema } from "mongoose";

const propertyInfoSchema = new mongoose.Schema({
  propertyName: String,

  logo: String,

  code: String,

  towerName: [
    {
      name: String,

      code: String,

      propertyType: [
        {
          name: String,

          type: String,

          customizationsApplicable: Boolean,
        },
      ],
    },
  ],

  active: { type: Boolean, default: false },
});

const PropertyInfos = mongoose.model("propertyInfos", propertyInfoSchema);

export default PropertyInfos;
