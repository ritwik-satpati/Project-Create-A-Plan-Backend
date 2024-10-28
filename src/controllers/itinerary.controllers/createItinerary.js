import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";
import { Itinerary } from "../../models/itinerary.model.js";

const sampleItinerary = {
  itinerary: [
    {
      day: 1,
      date: "2024-11-23",
      desc: "First day of the trip",
      plans: [
        {
          type: "Visit",
          plan: "Visit 01",
          time: "10:00",
          link: "https://google.com",
        },
        {
          type: "Activity",
          plan: "Activity 01",
          time: "12:00",
          link: "https://google.com",
        },
        {
          type: "Visit",
          plan: "Visit 02",
          time: "14:00",
          link: "https://google.com",
        },
      ],
    },
    {
      day: 2,
      date: "2024-11-24",
      desc: "Second day of the trip",
      plans: [
        {
          type: "Visit",
          plan: "Visit 03",
          time: "10:00",
          link: "https://google.com",
        },
        {
          type: "Activity",
          plan: "Activity 02",
          time: "12:00",
          link: "https://google.com",
        },
        {
          type: "Visit",
          plan: "Visit 04",
          time: "14:00",
          link: "https://google.com",
        },
      ],
    },
  ],
  note: "This is a Sample itinerary. Go and Edit your itinerary ...",
};

// *** Create A Itinerary ***
export const createItinerary = asyncHandler(async (req, res) => {
  // Retrieve user data from the request object using middleware
  const { user } = req;

  // Extract planId from request params
  const { planId } = req.params;

  // Find existedItinerary with its id
  const existedItinerary = await Itinerary.findById(planId);

  // Throw error if existedItinerary found
  if (existedItinerary) {
    throw new ApiError(401, "Itinerary is alreay created!");
  }

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

  // Create a new itinerary
  const createdItinerary = await Itinerary.create({
    _id: existedPlan._id,
    itinerary: sampleItinerary.itinerary,
    note: sampleItinerary.note,
  });

  // Throw error if createdItinerary is not there
  if (!createdItinerary) {
    throw new ApiError(400, "Itinerary creation failed, Try after sometime!");
  }

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Return a successful response with the created plan information
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        plan: existedPlan,
        itinerary: createdItinerary,
      },
      "Itinerary is created successfully"
    )
  );
});
