import { Router } from "express";

// ### Middlewares ###
import {
  createUserValidation,
  registerUserValidation,
  activeUserValidation,
  loginUserValidation,
} from "../validations/auth.validations.js";
import { validationHandler } from "../libs/validationHandler.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";

// ### Controllers ###
import { createUser } from "../controllers/auth.controllers/createUser.js";
import { registerUser } from "../controllers/auth.controllers/registerUser.js";
import { activeUser } from "../controllers/auth.controllers/activeUser.js";
import { loginUser } from "../controllers/auth.controllers/loginUser.js";
import { getUser } from "../controllers/auth.controllers/getUser.js";
import { logoutUser } from "../controllers/auth.controllers/logoutUser.js";

const router = Router();

// ### Routes ###

// *** User Creation ***
router
  .route("/create")
  .post(createUserValidation(), validationHandler, createUser);

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

// ### Routes => Secured ###

// *** User Information ***
router.route("/").get(userAuth, getUser);

// *** User Logout ***
router.route("/logout").post(logoutUser);

export default router;
