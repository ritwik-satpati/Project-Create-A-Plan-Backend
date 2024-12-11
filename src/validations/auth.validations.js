import { body, oneOf, param } from "express-validator";

// *** Validation for - User Creation ***
export const createUserValidation = () => [
  body("name", "Name is required").notEmpty(),
  body("mobile", "Mobile Number is required").isMobilePhone(),
  body("email", "Email is required").isEmail(),
  body("password", "Password is required").notEmpty(),
];

// *** Validation for - User Registration ***
export const registerUserValidation = () => [
  body("name", "Name is required").notEmpty(),
  // body("mobile", "Mobile Number is required").isMobilePhone(),
  body("email", "Email is required").isEmail(),
  body("password", "Password is required").notEmpty(),
];

// *** Validation for - User Activation ***
export const activeUserValidation = () => [
  param("activationToken", "Activation Token is required").notEmpty(),
];

// *** Validation for - User Login ***
export const loginUserValidation = () => [
  oneOf([body("mobile").isMobilePhone(), body("email").isEmail()], {
    message: "Email or Mobile number is required",
  }),
  body("password", "Password is required").notEmpty(),
];
