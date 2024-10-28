import { body, param } from "express-validator";

// *** Get A Itinerary ***
export const getItineraryValidation = () => [
  param("planId", "PlanId is required").notEmpty(),
];

// *** Create A Itinerary ***
export const createItineraryValidation = () => [
  param("planId", "PlanId is required").notEmpty(),
];

// *** Update A Itinerary ***
export const updateItineraryValidation = () => [
  param("planId", "PlanId is required").notEmpty(),
  body("itinerary", "Itinerary is required").notEmpty(),
];
