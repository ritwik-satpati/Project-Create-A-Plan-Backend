import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CAP_User } from "../models/user.model.js";

export const userAuth = asyncHandler(async (req, _, next) => {
  try {
    const existedAccount = req.account;

    // Find "CAP_User" role in role of ONE_Account
    const existedUserRole = existedAccount?.role.find(
      (option) => option?.name === "CAP_User"
    );
    if (!existedUserRole) {
      throw new ApiError(404, "User does not exist, Kindly contact support!");
    }

    const existedUser = await CAP_User.findById(existedUserRole.id);
    if (!existedUser) {
      throw new ApiError(404, "User does not exist, Kindly contact support!");
    }

    req.user = existedUser;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
