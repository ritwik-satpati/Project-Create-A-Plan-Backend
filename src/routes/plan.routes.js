import { Router } from "express";

// ### Middlewares ###
import {
  createPlanValidation,
  deletePlanValidation,
  updatePlanValidation,
} from "../validations/plan.validations.js";
import { validationHandler } from "../libs/validationHandler.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";

// ### Controllers ###
import { createPlan } from "../controllers/plan.controllers/createPlan.js";
import { getPlan } from "../controllers/plan.controllers/getPlan.js";
import { deletePlan } from "../controllers/plan.controllers/deletePlan.js";
import { updatePlan } from "../controllers/plan.controllers/updatePlan.js";
import { bookmarkPlan } from "../controllers/plan.controllers/bookmarkPlan.js";
import { getBookmarkedPlan } from "../controllers/plan.controllers/getBookmarkedPlan.js";

const router = Router();

// ### Routes ###

// ### Routes => Secured ###

// *** Create A Plan ***
router
  .route("/")
  .post(userAuth, createPlanValidation(), validationHandler, createPlan);

// *** Get A / Multiple Plan ***
router.route("/").get(userAuth, getPlan);

// *** Delete A Plan ***
router
  .route("/:planId")
  .delete(userAuth, deletePlanValidation(), validationHandler, deletePlan);

// *** Update A Plan ***
router
  .route("/:planId")
  .put(userAuth, updatePlanValidation(), validationHandler, updatePlan);

// *** Bookmark / Unbookmark A Plan ***
router.route("/bookmark").post(
  userAuth,
  // updatePlanValidation(), validationHandler,
  bookmarkPlan
);

// *** Get A / Multiple Bookmarked Plan ***
router.route("/bookmark").get(
  userAuth,
  // updatePlanValidation(), validationHandler,
  getBookmarkedPlan
);

export default router;
