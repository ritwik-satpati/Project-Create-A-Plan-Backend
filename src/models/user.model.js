// Import necessary libraries
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the User schema
const userSchema = new Schema(
  {
    // Name of the user
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Email address of the user (unique)
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Mobile number (unique)
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // Gender of the user (optional)
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    // Hashed password for authentication
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false, // Exclude password field from query results by default
    },
  },
  {
    // Automatic timestamps for creation and updates
    timestamps: true,
  }
);

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  // Check if the password is modified (or if it's a new document)
  if (!this.isModified("password")) return next();
  try {
    // Hash the password with bcrypt
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Method to check if the provided password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token for authentication
userSchema.methods.generateAccessToken = function () {
  // Ensure the token secret and expiry are set
  if (
    !process.env.USER_ACCESS_TOKEN_SECRET ||
    !process.env.USER_ACCESS_TOKEN_EXPIRY
  ) {
    throw new Error("Token secret or expiry not defined");
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.USER_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Export the User model
export const User = mongoose.model("User", userSchema);
