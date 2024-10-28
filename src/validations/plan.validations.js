import { body, param } from "express-validator";

// *** Create A Plan ***
export const createPlanValidation = () => [
  body("name", "Name is required").notEmpty(),
];

// *** Delete A Plan ***
export const deletePlanValidation = () => [
  param("planId", "PlanId is required").notEmpty(),
];

// *** Update A Plan ***
export const updatePlanValidation = () => [
  param("planId", "PlanId is required").notEmpty(),
  body("name", "Name is required").notEmpty(),
];
