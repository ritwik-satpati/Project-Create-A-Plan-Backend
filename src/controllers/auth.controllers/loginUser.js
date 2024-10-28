import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { cookieOptions } from "../../constants/cookieOptions.js";
import { User } from "../../models/user.model.js";

// *** User Login ***
export const loginUser = asyncHandler(async (req, res) => {
  // Extract email and password from the request body
  const { email, mobile, password } = req.body;

  // Find user with matching email or alternative email
  const existedUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { mobile: mobile }],
  }).select("+password"); // Include the password field for comparison

  // Throw error if user is not found
  if (!existedUser) {
    throw new ApiError(404, "User with email or mobile number does not exist!");
  }

  // Verify password matches the user's password (implementation from User model method)
  const isPasswordValid = await existedUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate an access token for the user (implementation from User model method)
  const userAccessToken = await existedUser.generateAccessToken();

  // Remove the password field from the user object before sending response
  existedUser.password = undefined;

  // Set the access token as a cookie and send a success response with user information
  return res
    .status(200)
    .cookie("userAccessToken", userAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: existedUser,
        },
        "User login successfully"
      )
    );
});
