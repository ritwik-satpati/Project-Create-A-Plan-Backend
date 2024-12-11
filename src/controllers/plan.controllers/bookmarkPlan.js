import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";
import { Bookmark } from "../../models/bookmark.model.js";

// *** Bookmark / Unbookmark A Plan ***
export const bookmarkPlan = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Extract planId from request body
  const { planId } = req.body;

  // Find existedPlan with its id
  const existedPlan = await Plan.findById(planId);

  // Throw error if existedPlan not found
  if (!existedPlan) {
    throw new ApiError(404, "Plan is not found!");
  }

  // Find bookmarkPlan with plan id & user id
  const bookmarkPlan = await Bookmark.findOne({
    plan: planId,
    user: user._id,
  });

  // Un-bookmark ==> if bookmarkPlan is found
  if (bookmarkPlan) {
    await Bookmark.findByIdAndDelete(bookmarkPlan);

    // Return a successful response with the message
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Plan is removed from bookmarks successfully")
      );
  }
  // Bookmark ==> if bookmarkPlan is not found
  else {
    // Create a bookmark data
    const newBookmarkPlan = await Bookmark.create({
      plan: planId,
      user: user._id,
    });

    // Throw error if newBookmarkPlan is not there
    if (!newBookmarkPlan) {
      throw new ApiError(
        400,
        "Failed to bookmark the plan. Please try again later!"
      );
    }

    // Return a successful response with the bookmarked plan information
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { bookmark: newBookmarkPlan },
          "Plan is bookmarked successfully"
        )
      );
  }
});
