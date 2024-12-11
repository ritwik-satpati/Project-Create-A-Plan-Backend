import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validationHandler = asyncHandler(async (req, _, next) => {
  const validationErrors = validationResult(req)?.errors;

  if (validationErrors.length != 0) {
    const errorMessage = validationErrors[0]?.msg;

    throw new ApiError(400, `${errorMessage}`);
  } else {
    return next();
  }
});

export { validationHandler };
