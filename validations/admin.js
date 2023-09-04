import { check } from "express-validator";

const adminLoginValidationRules = [
  check("email")
    .notEmpty()
    .withMessage("Email is mendatory")
    .trim()
    .toLowerCase()
    .if(check("type").equals("email"))
    .isEmail()
    .withMessage("Invalid email address"),

  check("password").notEmpty().withMessage("Password is mendatory"),
];

export { adminLoginValidationRules };
