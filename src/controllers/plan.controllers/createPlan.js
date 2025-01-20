import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CAP_Plan } from "../../models/plan.model.js";

// *** Create A Plan ***
export const createPlan = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract plan information from request body
  const { name, about, access, startDate, endDate, category } = req.body;

  // Create a new plan
  const createdPlan = await CAP_Plan.create({
    name,
    about: about || undefined,
    access,
    status: "Created",
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    category: category || undefined,
    createdBy: user._id,
  });

  // Throw error if createdPlan is not there
  if (!createdPlan) {
    throw new ApiError(400, "Plan creation failed, Try after sometime!");
  }

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Return a successful response with the created plan information
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { plan: createdPlan },
        "Plan is created successfully"
      )
    );
});
