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
import { accountAuth } from "../middlewares/AccountAuth.middleware.js";

const router = Router();

// ### Routes ###

// ### Routes => Secured ###

// *** Create A Plan ***
router
  .route("/")
  .post(
    accountAuth,
    userAuth,
    createPlanValidation(),
    validationHandler,
    createPlan
  );

// *** Get A / Multiple Plan ***
router.route("/").get(accountAuth, userAuth, getPlan);

// *** Delete A Plan ***
router
  .route("/:planId")
  .delete(
    accountAuth,
    userAuth,
    deletePlanValidation(),
    validationHandler,
    deletePlan
  );

// *** Update A Plan ***
router
  .route("/:planId")
  .put(
    accountAuth,
    userAuth,
    updatePlanValidation(),
    validationHandler,
    updatePlan
  );

// *** Bookmark / Unbookmark A Plan ***
router.route("/bookmark").post(
  accountAuth,
  userAuth,
  // updatePlanValidation(), validationHandler,
  bookmarkPlan
);

// *** Get A / Multiple Bookmarked Plan ***
router.route("/bookmark").get(
  accountAuth,
  userAuth,
  // updatePlanValidation(), validationHandler,
  getBookmarkedPlan
);

export default router;
