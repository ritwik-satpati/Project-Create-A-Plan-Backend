import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// *** User Information ***
export const getUser = asyncHandler(async (req, res) => {
  // Retrieve account & user data from the request object using middleware
  const { account, user } = req;

  // Remove the role & password field from the Account object before sending response
  account.role = undefined;
  account.password = undefined;

  // Return a successful response with account user information
  return res
    .status(200)
    .json(
      new ApiResponse(200, { account, user }, "User is fetched successfully")
    );
});
