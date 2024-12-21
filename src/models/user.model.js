// Import necessary libraries
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the User schema
const userSchema = new Schema(
  {
    // Reference to the account (ObjectId from the ONE_Account collection)
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ONE_Account",
    },
    // Name of the user
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Automatic timestamps for creation and updates
    timestamps: true,
  }
);

// // Method to generate an access token for authentication
// userSchema.methods.generateAccessToken = function () {
//   // Ensure the token secret and expiry are set
//   if (
//     !process.env.USER_ACCESS_TOKEN_SECRET ||
//     !process.env.USER_ACCESS_TOKEN_EXPIRY
//   ) {
//     throw new Error("Token secret or expiry not defined");
//   }
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.USER_ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// Export the User model
export const CAP_User = mongoose.model("CAP_User", userSchema);
