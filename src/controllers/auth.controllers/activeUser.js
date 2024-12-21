import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CAP_User } from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../../constants/cookieOptions.js";
import { ONE_Account } from "../../models/account.model.js";
import mongoose from "mongoose";

// *** User Activation ***
export const activeUser = asyncHandler(async (req, res) => {
  // Extract activationToken information from request params
  const { activationToken } = req.params;

  // Verify the ACCOUNT_ACTIVATION_SECRET and get account details
  const newAccount = jwt.verify(
    activationToken,
    process.env.ACCOUNT_ACTIVATION_SECRET
  );

  // If newAccount is not found, throw error
  if (!newAccount) {
    throw new ApiError(400, "Token is expired!");
  }

  // Get the details from new Account
  const { name, mobile, email, password, gender } = newAccount;

  // Check for existing account with various identifiers
  const existedAccount = await ONE_Account.findOne({
    // $or: [{ email: email.toLowerCase() }, { mobile: mobile }],
    email: email.toLowerCase(),
  });

  // Throw error if Account is found
  if (existedAccount) {
    throw new ApiError(409, "Account is already exist. Please log in!");
  }

  // Generate accountId & userId for ONE_Account & CAP_User
  const accountId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  // Create a new account and user concurrently
  const [createdAccount, createdUser] = await Promise.all([
    // Create a new account
    ONE_Account.create({
      _id: accountId,
      name,
      mobile,
      email: email.toLowerCase(), // Convert email to lowercase for case-insensitive matching
      password,
      gender: gender || undefined,
      role: {
        name: "CAP_User",
        id: userId,
        isActive: true,
      },
    }),
    // Create a new user
    CAP_User.create({
      _id: userId,
      accountId: accountId,
      name,
    }),
  ]);

  // If Account or User is not created, Throw an Error
  if (!createdAccount || !createdUser) {
    throw new ApiError(400, "Account is not created, Try after some time!");
  }

  // Generate an access token for the user (implementation from Account model method)
  const userAccessToken = await createdAccount.generateAccessToken();

  // Remove the role & password field from the Account object before sending response
  createdAccount.role = undefined;
  createdAccount.password = undefined;

  // Set the access token as a cookie and send a success response with account & user information
  return res
    .status(201)
    .cookie("userAccessToken", userAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          account: createdAccount,
          user: createdUser,
        },
        "User is registed successfully"
      )
    );
});
