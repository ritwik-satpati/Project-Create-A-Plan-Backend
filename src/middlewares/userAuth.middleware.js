import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const userAuth = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.userAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request, Kindly Login!");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.USER_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      // throw new ApiError(401, "Invalid Access Token!");
      throw new ApiError(401, "Please logout and login again!");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});
