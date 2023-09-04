import { check } from "express-validator";
import { projectsList } from "../data/projects.js";

const loginValidationRules = [
  // type must not be empty
  check("type")
    .notEmpty()
    .withMessage("Type is mendatory")
    .isIn(["email", "phone"])
    .withMessage("Invalid value for field: Type"),

  // value must not be empty
  check("value")
    .trim()
    .notEmpty()
    .withMessage("Email/Phone Number is mendatory"),

  // if value mail, check validity
  check("value")
    .trim()
    .toLowerCase()
    .if(check("type").equals("email"))
    .isEmail()
    .withMessage("Invalid email address"),

  // if value phone, check validity
  check("value")
    .trim()
    .if(check("type").equals("phone"))
    .isInt()
    .withMessage("Phone Number should contain integers only")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number should be of 10 digits"),
];

const otpValidationRules = [
  ...loginValidationRules,

  // Otp must not be empty & must be a 6 digit integer
  check("otp")
    .notEmpty()
    .withMessage("OTP value is mendatory")
    .isInt()
    .withMessage("OTP should only contain integers")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP should be of 6 digits"),
];

const otpRetryValidationRules = [...loginValidationRules];

const inquiryValidationRules = [
  // name must not be empty
  check("name").notEmpty().withMessage("Name is mendatory"),

  // email, check validity
  check("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email ID is mendatory")
    .isEmail()
    .withMessage("Invalid email ID"),

  // phone, check validity
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is mendatory")
    .isInt()
    .withMessage("Phone Number should contain integers only")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number should be of 10 digits"),

  // phone, check validity
  check("project")
    .trim()
    .notEmpty()
    .withMessage("Project is mendatory")
    .isIn(projectsList)
    .withMessage("Invalid project selected"),

  check("message").notEmpty().withMessage("Message is mendatory"),
];

export { loginValidationRules, otpValidationRules, inquiryValidationRules };
