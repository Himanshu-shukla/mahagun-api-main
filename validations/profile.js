import { check } from "express-validator";

const personalInfoValidationRules = [
  check("name").notEmpty().withMessage("Name is mendatory"),

  check("pa").notEmpty().withMessage("Permanent address is mendatory"),

  check("paCity").notEmpty().withMessage("Permanent address city is mendatory"),

  check("paState")
    .notEmpty()
    .withMessage("Permanent address state is mendatory"),

  check("paPincode")
    .notEmpty()
    .withMessage("Permanent address pincode is mendatory")
    .isInt()
    .withMessage("Permanent address pincode should contain integers only")
    .isLength({ min: 6, max: 6 })
    .withMessage("Permanent address pincode should be of 6 digits"),

  check("ca").notEmpty().withMessage("Current address is mendatory"),

  check("caCity").notEmpty().withMessage("Current address city is mendatory"),

  check("caState").notEmpty().withMessage("Current address state is mendatory"),

  check("caPincode")
    .notEmpty()
    .withMessage("Current address pincode is mendatory")
    .isInt()
    .withMessage("Current address pincode should contain integers only")
    .isLength({ min: 6, max: 6 })
    .withMessage("Current address pincode should be of 6 digits"),

  check("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email address is mendatory")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is mendatory")
    .isInt()
    .withMessage("Phone number should contain integers only")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number should be of 10 digits"),

  check("alternatePhone")
    .trim()
    .notEmpty()
    .withMessage("Alternate phone number is mendatory")
    .isInt()
    .withMessage("Alternate phone number should contain integers only")
    .isLength({ min: 10, max: 10 })
    .withMessage("Alternate phone number should be of 10 digits"),

  check("dob")
    .notEmpty()
    .withMessage("Date of birth is mendatory")
    .isISO8601()
    .toDate()
    .withMessage("Invlaid date of birth"),
];

const bankInfoValidationRules = [
  check("accountNumber")
    .notEmpty()
    .withMessage("Account number is mendatory")
    .isInt()
    .withMessage("Account number should contain integers only")
    .isLength({ min: 8, max: 18 })
    .withMessage("Account number should be between 8-18 digits"),

  check("accountName").notEmpty().withMessage("Account name is mendatory"),

  check("ifsc").notEmpty().withMessage("IFSC code is mendatory"),

  check("accountType")
    .notEmpty()
    .withMessage("Account type is mendatory")
    .isIn(["current", "saving"])
    .withMessage("Account type can be saving or current"),

  check("gstNumber")
    .optional()
    .isLength({ min: 15, max: 15 })
    .withMessage("GST number should be of 15 digits"),
];

const propertyInfoValidationRules = [
  check("projectName")
    .notEmpty()
    .withMessage("Project name is mendatory")
    .isIn(["Mezzaria", "Meeadow", "Manorialle", "Medalleo"])
    .withMessage(
      "Project name should be from Mezzaria, Meeadow, Manorialle, Medalleo"
    ),

  check("propertyCode")
    .notEmpty()
    .withMessage("Property code is mendatory")
    .isLength({ min: 3, max: 3 })
    .withMessage("Property code should be of 3 characters"),

  check("purchaseDate").notEmpty().withMessage("Purchase date is mendatory"),

  check("tower").notEmpty().withMessage("Tower/Block name is mendatory"),

  check("towerCode")
    .notEmpty()
    .withMessage("Tower/Block code is mendatory")
    .isLength({ min: 3, max: 3 })
    .withMessage("Tower/Block code should be of 3 character"),

  check("wingUnitNo").notEmpty().withMessage("Wing and Unit no. is mendatory"),

  check("propertyType").notEmpty().withMessage("Property type is mendatory"),
];

export {
  personalInfoValidationRules,
  bankInfoValidationRules,
  propertyInfoValidationRules,
};
