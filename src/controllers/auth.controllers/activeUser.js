import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../../constants/cookieOptions.js";

// *** User Activation ***
export const activeUser = asyncHandler(async (req, res) => {
  // Extract activationToken information from request params
  const { activationToken } = req.params;

  // Verify the USER_ACTIVATION_SECRET and get user details
  const newUser = jwt.verify(
    activationToken,
    process.env.USER_ACTIVATION_SECRET
  );

  // If newUser is not found, throw error
  if (!newUser) {
    throw new ApiError(400, "Token is expired!");
  }

  // Get the details from new user
  const { name, mobile, email, password, gender } = newUser;

  // Check for existing user with various identifiers
  const existedUser = await User.findOne({
    // $or: [{ email: email.toLowerCase() }, { mobile: mobile }],
    email: email.toLowerCase(),
  });

  // Throw error if user is found
  if (existedUser) {
    throw new ApiError(409, "User is already activated. Please log in!");
  }

  // Create a new user
  const createdUser = await User.create({
    name,
    mobile: mobile || undefined,
    email: email.toLowerCase(),
    password,
    gender: gender || undefined,
  });

  // Generate an access token for the user (implementation from User model method)
  const userAccessToken = await createdUser.generateAccessToken();

  // Remove the password field from the user object before sending response
  createdUser.password = undefined;

  // Set the access token as a cookie and send a success response with creted user information
  return res
    .status(201)
    .cookie("userAccessToken", userAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User is activated successfully"
      )
    );
});
