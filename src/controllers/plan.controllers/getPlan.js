import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";

// *** Get A / Multiple Plan ***
export const getPlan = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract planId from request query
  const { planId } = req.query;

  // Get A Plan ==> If planId is there
  if (planId) {
    // Find existedPlan with its id
    const existedPlan = await Plan.findById(planId);

    // Throw error if existedPlan not found
    if (!existedPlan) {
      throw new ApiError(404, "Plan is not found!");
    }

    // // Throw error if existedPlan is not created by the user
    // if (existedPlan.createdBy.toString() !== user._id.toString()) {
    //   throw new ApiError(401, "Not authorized to view!");
    // }

    // // Remove the password field from the user object before sending response
    // user.password = undefined;

    // Return a successful response with the existed plan information
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          plan: existedPlan,
        },
        "Plan is fetched successfully"
      )
    );
  }

  // Get Multiple Plans ==> If planId is not there
  else {
    // Find existedPlan with its id
    const existedPlans = await Plan.find({ createdBy: user._id }).sort({
      updatedAt: -1,
    });

    //   // Throw error if existedPlan not found
    //   if (existedPlans.length === 0) {
    //     throw new ApiError(404, "No Plan is found!");
    //   }

    // Setting up Success Message
    let successMessage;

    if (existedPlans.length > 0) {
      if (existedPlans.length > 1) {
        successMessage = `${existedPlans.length} Plans are fetched successfully`;
      } else {
        successMessage = `${existedPlans.length} Plan is fetched successfully`;
      }
    } else {
      successMessage = `No Plan is fetched`;
    }

    // Remove the password field from the user object before sending response
    user.password = undefined;

    // Return a successful response with the existed plan information
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          plans: existedPlans,
        },
        successMessage
      )
    );
  }
});
