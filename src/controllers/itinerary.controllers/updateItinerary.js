import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CAP_Plan } from "../../models/plan.model.js";
import { CAP_Itinerary } from "../../models/itinerary.model.js";

// *** Update A Itinerary ***
export const updateItinerary = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract planId from request params
  const { planId } = req.params;

  // Extract plan information from request body
  const { itinerary, note } = req.body;

  // Find existedPlan with its id
  const existedPlan = await CAP_Plan.findById(planId);

  // Throw error if existedPlan not found
  if (!existedPlan) {
    throw new ApiError(404, "Plan is not found!");
  }

  // Throw error if existedPlan is not created by the user
  if (existedPlan.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(401, "Not authorized to update!");
  }

  // Find existedItinerary with its id
  const existedItinerary = await CAP_Itinerary.findById(existedPlan._id);

  // Throw error if existedItinerary not found
  if (!existedItinerary) {
    throw new ApiError(
      301,
      "Itinerary is not created yet, Create a Itinerary first!"
    );
  }

  // Update the Itinerary
  const updatedItinerary = await CAP_Itinerary.findByIdAndUpdate(
    { _id: existedItinerary._id },
    {
      itinerary,
      note: note || undefined,
    },
    { new: true }
  );

  // Throw error if updateItinerary is not there
  if (!updatedItinerary) {
    throw new ApiError(401, "Itinerary updation failed, Try after sometime!");
  }

  // Update ExistedPlan's updated at
  const updatedExistedPlan = await CAP_Plan.findByIdAndUpdate(
    existedPlan._id,
    {
      status: "Ongoing",
      updatedAt: Date.now(),
    },
    { new: true }
  );

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Return a successful response with the updated plan information
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        plan: updatedExistedPlan,
        itinerary: updatedItinerary,
      },
      "Itinerary is updated successfully"
    )
  );
});
