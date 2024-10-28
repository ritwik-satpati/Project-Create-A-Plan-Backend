import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";
import { Bookmark } from "../../models/bookmark.model.js";

// *** Get A / Multiple Bookmarked Plan ***
export const getBookmarkedPlan = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract planId from request query
  const { planId, bookmarkId } = req.query;

  // Get A Bookmark Plan using planId ==> If planId is there
  if (planId) {
    // Find existedBookmarkPlan with its id
    const existedBookmarkPlan = await Bookmark.findOne({
      user: user._id,
      plan: planId,
    });

    // Throw error if existedBookmarkPlan not found
    if (!existedBookmarkPlan) {
      // Return a successful response with the existed plan information
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            bookmark: null,
          },
          "Plan is not bookmarked"
        )
      );
      // throw new ApiError(404, "Bookmarked Plan is not found!");
    }

    // Remove the password field from the user object before sending response
    user.password = undefined;

    // Return a successful response with the existed plan information
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          bookmark: existedBookmarkPlan,
        },
        "Bookmark Plan is fetched successfully"
      )
    );
  }

  // Get A Bookmark Plan using bookmarkId ==> If bookmarkId is there
  else if (bookmarkId) {
    // Find existedBookmarkPlan with its id
    const existedBookmarkPlan = await Bookmark.findById(bookmarkId);

    // Throw error if existedBookmarkPlan not found
    if (!existedBookmarkPlan) {
      throw new ApiError(404, "Bookmarked Plan is not found!");
    }

    // Remove the password field from the user object before sending response
    user.password = undefined;

    // Return a successful response with the existed plan information
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          bookmark: existedBookmarkPlan,
        },
        "Bookmark Plan is fetched successfully"
      )
    );
  }

  // Get Multiple Bookmark Plans ==> If planId & bookmarkId both are not there
  else {
    // Find existedBookmarkPlan with its id
    const existedBookmarkPlans = await Bookmark.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .populate("plan", "_id name");

    //   // Throw error if existedBookmarkPlan not found
    //   if (existedBookmarkPlans.length === 0) {
    //     throw new ApiError(404, "No Bookmark Plan is found!");
    //   }

    // Setting up Success Message
    let successMessage;

    if (existedBookmarkPlans.length > 0) {
      if (existedBookmarkPlans.length > 1) {
        successMessage = `${existedBookmarkPlans.length} Bookmarked Plans are fetched successfully`
      } else {
        successMessage = `${existedBookmarkPlans.length} Bookmarked Plan is fetched successfully`
      }
    } else {
      successMessage = `No Plan is Bookmarked`
    }

    // Remove the password field from the user object before sending response
    user.password = undefined;

    // Return a successful response with the existed plan information
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          bookmarks: existedBookmarkPlans,
        },
        successMessage
      )
    );
  }
});
