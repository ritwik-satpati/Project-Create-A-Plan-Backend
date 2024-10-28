import { Router } from "express";

// ### Middlewares ###
import {
  createItineraryValidation,
  getItineraryValidation,
  updateItineraryValidation,
} from "../validations/itinerary.validations.js";
import { validationHandler } from "../libs/validationHandler.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";

// ### Controllers ###
import { createItinerary } from "../controllers/itinerary.controllers/createItinerary.js";
import { getItinerary } from "../controllers/itinerary.controllers/getItinerary.js";
import { updateItinerary } from "../controllers/itinerary.controllers/updateItinerary.js";

const router = Router();

// ### Routes ###

// *** Get A Itinerary ***
router
  .route("/:planId")
  .get(getItineraryValidation(), validationHandler, getItinerary);

// ### Routes => Secured ###

// *** Create A Itinerary ***
router
  .route("/:planId")
  .post(
    userAuth,
    createItineraryValidation(),
    validationHandler,
    createItinerary
  );

// *** Update A Itinerary ***
router
  .route("/:planId")
  .put(
    userAuth,
    updateItineraryValidation(),
    validationHandler,
    updateItinerary
  );

export default router;
