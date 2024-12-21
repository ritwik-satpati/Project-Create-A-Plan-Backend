import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CAP_Plan } from "../../models/plan.model.js";
import { CAP_Bookmark } from "../../models/bookmark.model.js";
import { CAP_Itinerary } from "../../models/itinerary.model.js";

// *** Delete A Plan ***
export const deletePlan = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract planId from request params
  const { planId } = req.params;

  // Find existedPlan with its id
  const existedPlan = await CAP_Plan.findById(planId);

  // Throw error if existedPlan not found
  if (!existedPlan) {
    throw new ApiError(404, "Plan is not found!");
  }

  // Throw error if existedPlan is not created by the user
  if (existedPlan.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(401, "Not authorized to delete!");
  }

  // Checking if anyone bookmarked the plan
  const bookmarkedPlans = await CAP_Bookmark.find({ plan: existedPlan._id });
  if (bookmarkedPlans.length > 0) {
    throw new ApiError(
      401,
      "Someone bookmarked this Plan & Bookmarked Plans cannot be deleted!"
    );
  }

  let successMessage = "Plan is deleted successfully";

  // Find existedPlan with its id
  const existedItinerary = await CAP_Itinerary.findById(planId);

  // Delete Itinerary first if existedItinerary found
  if (existedItinerary) {
    await CAP_Itinerary.findByIdAndDelete(planId);
    successMessage = "Plan along with Itinerary is deleted successfully";
  }

  // Delete the Plan using its id
  await CAP_Plan.findByIdAndDelete(planId);

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Return a successful response
  return res.status(200).json(new ApiResponse(200, {}, successMessage));
});
