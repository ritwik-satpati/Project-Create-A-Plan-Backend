import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ONE_Account } from "../models/account.model.js";

export const accountAuth = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.userAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request, Kindly Login!");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCOUNT_ACCESS_TOKEN_SECRET
    );

    const existedAccount = await ONE_Account.findById(decodedToken?._id).select(
      "-password"
    );

    if (!existedAccount) {
      throw new ApiError(401, "Please logout and login again!");
    }

    req.account = existedAccount;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
