import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { cookieOptions } from "../../constants/cookieOptions.js";
import { CAP_User } from "../../models/user.model.js";
import { ONE_Account } from "../../models/account.model.js";

// *** User Login ***
export const loginUser = asyncHandler(async (req, res) => {
  // const { email, mobile, password } = req.body;
  const { email, password } = req.body;

  // Find account with matching email or alternative email
  const existedAccount = await ONE_Account.findOne({
    // $or: [{ email: email.toLowerCase() }, { mobile: mobile }],
    email: email.toLowerCase(),
  }).select("+password"); // Include the password field for comparison

  // Throw error if account is not found
  if (!existedAccount) {
    throw new ApiError(
      404,
      "Account with email or mobile number does not exist!"
    );
  }

  // Verify password matches the Account's password (implementation from Account model method)
  const isPasswordValid = await existedAccount.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Account credentials");
  }

  // Generate an access token for the user (implementation from Account model method)
  const userAccessToken = await existedAccount.generateAccessToken();

  // Find "CAP_User" role in role of ONE_Account
  const existedUserRole = existedAccount?.role.find(
    (option) => option?.name === "CAP_User"
  );
  if (!existedUserRole) {
    // Remove the role & password field from the user object before sending response
    existedAccount.role = undefined;
    existedAccount.password = undefined;

    // Option to create user :)

    // Set the access token as a cookie and send a success response with account & user information
    return res
      .status(200)
      .cookie("userAccessToken", userAccessToken, cookieOptions)
      .json(
        new ApiResponse(
          300,
          {
            account: existedAccount,
          },
          "Need to create as a new user"
        )
      );
  }

  // Find user with matching accountId userId
  const existedUser = await CAP_User.findById(existedUserRole.id);

  // Throw error if user is not found
  if (!existedUser) {
    throw new ApiError(404, "User does not exist, Kindly contact support!");
  }

  // Remove the role & password field from the user object before sending response
  existedAccount.role = undefined;
  existedAccount.password = undefined;

  // Set the access token as a cookie and send a success response with user information
  return res
    .status(200)
    .cookie("userAccessToken", userAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          account: existedAccount,
          user: existedUser,
        },
        "User login successfully"
      )
    );
});
