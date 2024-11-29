import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";
import { Itinerary } from "../../models/itinerary.model.js";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";

// *** Get A Itinerary ***
export const getItinerary = asyncHandler(async (req, res) => {
  // Extract planId from request params
  const { planId } = req.params;

  // Find existedPlan with its id
  let existedPlan = await Plan.findById(planId).populate({
    path: "createdBy",
    select: "_id name",
  });

  // Throw error if existedPlan not found
  if (!existedPlan) {
    throw new ApiError(404, "Plan is not found!");
  }

  // Reformat the existedPlan
  existedPlan = {
    ...existedPlan.toObject(), // Convert Mongoose document to plain object
    createdBy: existedPlan.createdBy._id,
    createdByName: existedPlan.createdBy.name,
  };

  // Find existedItinerary with its id
  const existedItinerary = await Itinerary.findById(planId);

  // // Throw error if existedItinerary not found
  // if (!existedItinerary) {
  //   throw new ApiError(
  //     300,
  //     "Itinerary is not created yet, Create a Itinerary first!"
  //   );
  // }

  // If Plan access type is not Public
  if (existedPlan.access !== "Public") {
    // Need to Login the user
    const token =
      req.cookies?.userAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // throw new ApiError(300, "Plan is not Public, need to Login first!");
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            plan: null,
            itinerary: null,
          },
          "Plan is not Public, need to Login first!"
        )
      );
    }

    const decodedToken = jwt.verify(
      token,
      process.env.USER_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token!");
    }

    // If Plan access type is Private
    if (existedPlan.access === "Private") {
      // Throw error if existedPlan is not created by the user
      if (existedPlan.createdBy.toString() !== user._id.toString()) {
        // throw new ApiError(401, "Not authorized to view!");
        // Return a successful response with the existed plan information
        return res.status(200).json(
          new ApiResponse(
            200,
            {
              plan: existedPlan,
              itinerary: null,
            },
            "Plan is Private"
          )
        );
      }
    }
    // If Plan access type is Restricted
    else if (existedPlan.access === "Restricted") {
      // Check if userId is in the shared array and get its permission
      const sharedEntry = existedPlan?.shared.find(
        (option) => option.userId.toString() === user._id.toString()
      );

      // Throw error if sharedEntry is not found
      if (!sharedEntry) {
        throw new ApiError(401, "No permission to view or edit!");
      }
    }

    // Remove the password field from the user object before sending response
    user.password = undefined;
  }

  // Return a successful response with the existed plan information
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        plan: existedPlan,
        itinerary: existedItinerary || null,
      },
      "Plan is fetched successfully"
    )
  );
});
