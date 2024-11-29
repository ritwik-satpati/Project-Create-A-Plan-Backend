// Import necessary libraries
import mongoose, { Schema } from "mongoose";
import { planTypes } from "../constants/planTypes.js";

// Define the Itinerary schema
const itinerarySchema = new Schema(
  {
    // Itinerary array to hold daily plans
    itinerary: {
      // Array without ids
      type: Array,
      _id: false,

      // Day number of the itinerary
      day: {
        type: Number,
        required: true, // Ensures that day is provided
      },

      // Date for the day in the itinerary (e.g., "2024-08-30")
      date: {
        type: String,
        required: true, // Ensures that date is provided
      },

      // Description of the day's activities or plans
      desc: {
        type: String,
        required: true, // Ensures that description is provided
      },

      // Array of plans or activities for that day
      plans: [
        {
          // Type of plan (e.g., "activity", "meeting", etc.)
          type: {
            type: String,
            required: true, // Ensures that type is provided
            enum: planTypes
          },

          // Details of the plan (e.g., "Visit the museum")
          plan: {
            type: String,
            required: true, // Ensures that plan details are provided
          },

          // Time of the plan
          time: {
            type: Date,
            // type: String,
          },

          // Optional link related to the plan (e.g., URL to a reservation or more information)
          link: {
            type: String,
            trim: true, // Trim white space from the link
          },
        },
      ],
    },

    // Note for the plans
    note: {
      type: String,
      trim: true,
    },
  },
  {
    // Automatic timestamps for creation and updates
    timestamps: true,
  }
);

// Export the Itinerary model
export const Itinerary = mongoose.model("Itinerary", itinerarySchema);
