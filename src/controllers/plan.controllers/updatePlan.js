import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";

// *** Update A Plan ***
export const updatePlan = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract planId from request params
  const { planId } = req.params;

  // Extract plan information from request body
  const { name, about, access } = req.body;

  // Find existedPlan with its id
  const existedPlan = await Plan.findById(planId);

  // Throw error if existedPlan not found
  if (!existedPlan) {
    throw new ApiError(404, "Plan is not found!");
  }

  // Throw error if existedPlan is not created by the user
  if (existedPlan.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(401, "Not authorized to update!");
  }

  // Update the plan
  const updatedPlan = await Plan.findByIdAndUpdate(
    { _id: existedPlan._id },
    {
      name,
      about: about || undefined,
      access,
    },
    { new: true }
  );

  // Throw error if updatePlan is not there
  if (!updatedPlan) {
    throw new ApiError(401, "Plan updation failed, Try after sometime!");
  }

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Return a successful response with the updated plan information
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { plan: updatedPlan },
        "Plan is updated successfully"
      )
    );
});
