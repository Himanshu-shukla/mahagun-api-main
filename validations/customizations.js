import { check } from "express-validator";

const customizationSaveRules = [
  check("customizationData")
    .isArray()
    .notEmpty()
    .withMessage("Invalid customization data"),

  check("propertyId").notEmpty().withMessage("Property Id is mendatory"),
];

const customizationUpdateRules = [
  check("customizationData")
    .isArray()
    .notEmpty()
    .withMessage("Invalid customization data"),

  check("cid").notEmpty().withMessage("Customization detail Id is mendatory"),
];

const customizationGetRules = [
  check("propertyId").notEmpty().withMessage("Property Id is mendatory"),
];

const customizationAcceptRules = [
  check("propertyId").notEmpty().withMessage("Property Id is mendatory"),

  check("upgrades").notEmpty().withMessage("Upgrades is mendatory"),
];

export {
  customizationSaveRules,
  customizationUpdateRules,
  customizationGetRules,
  customizationAcceptRules,
};
