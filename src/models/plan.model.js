// Import necessary libraries
import mongoose, { Schema } from "mongoose";
import { planCategories } from "../constants/planCategories.js";

// Define the Plan schema
const planSchema = new Schema(
  {
    // Name of the user who created the plan
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // A brief description or overview of the plan
    about: {
      type: String,
      required: true,
      trim: true,
    },

    //
    status: {
      type: String,
      default: "Created", // "Created" / "Updated" / "Ongoing" / "Completed"
    },

    // Access Type
    access: {
      type: String,
      default: "Public",
      enum: ["Public", "Private", "Restricted"],
    },

    // // If access Type is Restricted
    // permissions: {
    //   // Array of userIds
    //   view: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //     },
    //   ],
    //   // Array of userIds
    //   edit: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //     },
    //   ],
    // },

    // Shared user id & permisssion
    shared: {
      // Array without ids
      type: Array,
      _id: false,

      //
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },

      //
      permission: {
        type: String,
        default: "view",
        enum: ["edit", "view"],
      },
    },

    //
    startDate: {
      type: String,
    },
    //
    endDate: {
      type: String,
    },

    //
    category: {
      type: Array,
      // enum: planCategories,
    },

    // //
    // tags: {
    //   type: Array,
    //   default: undefined,
    // },

    // //
    // places: {
    //   type: Array,
    //   default: undefined,
    // },

    // Reference to the user who created the plan (ObjectId from the CAP_User collection)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CAP_User",
    },
  },
  {
    // Automatic timestamps for creation and updates
    timestamps: true,
  }
);

// Export the Plan model
export const CAP_Plan = mongoose.model("CAP_Plan", planSchema);
