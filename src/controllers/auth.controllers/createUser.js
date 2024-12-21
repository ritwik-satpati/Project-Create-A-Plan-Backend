import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CAP_User } from "../../models/user.model.js";
import { ONE_Account } from "../../models/account.model.js";
import { cookieOptions } from "../../constants/cookieOptions.js";

// *** User Creation ***
export const createUser = asyncHandler(async (req, res) => {
  // Extract account information from mddleware
  const existedAccount = req.account;

  // Find "CAP_User" role in role of ONE_Account
  const existedUserRole = existedAccount?.role.find(
    (option) => option?.name === "CAP_User"
  );
  if (existedUserRole) {
    throw new ApiError(404, "User is already exist, Kindly Reload the Page!");
  }

  // Create a new User
  const createdUser = await CAP_User.create({
    accountId: existedAccount._id,
    name: existedAccount.name,
  });

  // If User is not created, Throw Error
  if (!createdUser) {
    throw new ApiError(400, "User is not created, Try after some time!");
  }

  // Update the created account
  const updatedAccount = await ONE_Account.findByIdAndUpdate(
    existedAccount._id,
    {
      $push: {
        role: {
          name: "CAP_User",
          id: createdUser._id,
          isActive: true,
        },
      },
    },
    { new: true }
  );

  // If Account is not updated, Throw Error
  if (!updatedAccount) {
    throw new ApiError(400, "Account is not updated, Try after some time!");
  }

  // Generate an access token for the user (implementation from Account model method)
  const userAccessToken = await existedAccount.generateAccessToken();

  // Remove the role & password field from the user object before sending response
  updatedAccount.role = undefined;
  updatedAccount.password = undefined;

  // Set the access token as a cookie and send a success response with account & user information
  return res
    .status(201)
    .cookie("userAccessToken", userAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          account: updatedAccount,
          user: createdUser,
        },
        "User is registed successfully"
      )
    );
});
