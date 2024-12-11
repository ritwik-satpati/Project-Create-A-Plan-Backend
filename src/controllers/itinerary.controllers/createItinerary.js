import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Plan } from "../../models/plan.model.js";
import { Itinerary } from "../../models/itinerary.model.js";

// Sample Itinerary Data
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

// Function - calculateDateGap
function calculateDateGap(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceInMs = end - start;

  // Convert milliseconds to days
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  // Return differenceInDays
  return differenceInDays;
}

// Function - dateString
function dateString(date, i) {
  let newDate = new Date(date);
  // Add i day to the date
  newDate.setDate(newDate.getDate() + i);
  // Format the new date as "yyyy-MM-dd"
  let newDateStr = newDate.toISOString().split("T")[0];

  //Return
  return newDateStr;
}

// Function - dynamicItinerary
function dynamicItinerary(startDate, endDate) {
  // Get differenceInDays from calculateDateGap function
  const differenceInDays = calculateDateGap(startDate, endDate);
  // console.log(differenceInDays)

  // Initialise dynamicItinerary
  let dynamicItinerary = [
    {
      day: 0,
      date: dateString(startDate, -1),
      desc: "Starting of the trip",
      plans: [
        {
          type: "Travel",
          plan: "Start from XXX",
          time: "22:00",
          link: "https://google.com",
        },
      ],
    },
  ];

  // Initialise i for the loop
  let i;
  for (i = 1; i <= differenceInDays; i++) {
    let itinerary = {
      day: i,
      date: dateString(startDate, i - 1),
      desc: `Day ${i} of the trip`,
      plans: [
        {
          type: "Visit",
          plan: "Visit XXX",
          time: "10:00",
          link: "https://google.com",
        },
        {
          type: "Activity",
          plan: "Activity XXX",
          time: "12:00",
          link: "https://google.com",
        },
      ],
    };

    // Add the new in itinerary in dynamicItinerary array
    dynamicItinerary = [...dynamicItinerary, itinerary];
  }

  // Return
  return dynamicItinerary;
}

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

  // Make Itinerary
  let itinerary;
  if (!existedPlan.startDate) {
    itinerary = sampleItinerary.itinerary;
  } else {
    itinerary = dynamicItinerary(existedPlan?.startDate, existedPlan?.endDate);
  }

  console.log(itinerary);
  // throw new ApiError(400, "Itinerary creation failed, Try after sometime!");

  // Create a new itinerary
  const createdItinerary = await Itinerary.create({
    _id: existedPlan._id,
    itinerary: itinerary,
    note: sampleItinerary.note,
  });

  // Throw error if createdItinerary is not there
  if (!createdItinerary) {
    throw new ApiError(400, "Itinerary creation failed, Try after sometime!");
  }

  // Update ExistedPlan's updated at
  const updatedExistedPlan = await Plan.findByIdAndUpdate(
    existedPlan._id,
    {
      updatedAt: Date.now(),
    },
    { new: true }
  );

  // Remove the password field from the user object before sending response
  user.password = undefined;

  // Return a successful response with the created plan information
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        plan: updatedExistedPlan,
        itinerary: createdItinerary,
      },
      "Itinerary is created successfully"
    )
  );
});
