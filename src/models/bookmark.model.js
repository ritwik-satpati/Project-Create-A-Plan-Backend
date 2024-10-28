// Import necessary libraries
import mongoose, { Schema } from "mongoose";

// Define the Bookmark schema
const bookmarkSchema = new Schema(
  {
    // Plan Id
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Plan",
    },

    // User Id
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    // Automatic timestamps for creation and updates
    timestamps: true,
  }
);

// Export the Bookmark model
export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
