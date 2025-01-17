import { Router } from "express";

// ### Middlewares ###
import {
  registerUserValidation,
  activeUserValidation,
  loginUserValidation,
  resetPasswordValidation,
  forgetPasswordValidation,
} from "../validations/auth.validations.js";
import { validationHandler } from "../libs/validationHandler.js";
import { accountAuth } from "../middlewares/AccountAuth.middleware.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";

// ### Controllers ###
import { registerUser } from "../controllers/auth.controllers/registerUser.js";
import { activeUser } from "../controllers/auth.controllers/activeUser.js";
import { loginUser } from "../controllers/auth.controllers/loginUser.js";
import { logoutUser } from "../controllers/auth.controllers/logoutUser.js";
import { getUser } from "../controllers/auth.controllers/getUser.js";
import { createUser } from "../controllers/auth.controllers/createUser.js";
import { forgetPassword } from "../controllers/auth.controllers/forgetPassword.js";
import { resetPassword } from "../controllers/auth.controllers/resetPassword.js";

const router = Router();

// ### Routes ###

// *** User Registration ***
router
  .route("/register")
  .post(registerUserValidation(), validationHandler, registerUser);

// *** User Activation ***
router
  .route("/active/:activationToken")
  .post(activeUserValidation(), validationHandler, activeUser);

// *** User Login ***
router
  .route("/login")
  .post(loginUserValidation(), validationHandler, loginUser);

// *** User Logout ***
router.route("/logout").post(logoutUser);

// *** Forget Password ***
router
  .route("/forget-password")
  .post(forgetPasswordValidation(), validationHandler, forgetPassword);

// *** Reset Password ***
router
  .route("/reset-password/:accountId/:token")
  .post(resetPasswordValidation(), validationHandler, resetPassword);

// ### Routes => Secured ###

// *** User Information ***
router.route("/").get(accountAuth, userAuth, getUser);

// *** User Creation ***
router.route("/create").post(accountAuth, createUser);

export default router;
