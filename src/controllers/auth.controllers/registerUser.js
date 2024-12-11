import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { supportedMailDomain } from "../../constants/supportedMailDomain.js";
import jwt from "jsonwebtoken";
import sendMail from "../../libs/sendMail.js";

// *** User Registration ***
export const registerUser = asyncHandler(async (req, res) => {
  // Extract user information from request body
  // const { name, mobile, email, password, gender, queryString } = req.body;
  const { name, email, password, gender, queryString } = req.body;

  // Checking email mail domain
  const domain = email.substring(email.indexOf("@"));

  // If mail doomin is not listed
  if (!supportedMailDomain.includes(domain)) {
    throw new ApiError(
      400,
      "Invalid email domain. Please check the list of supported domains."
    );
  }

  // Check for existing user with various identifiers
  const existedUser = await User.findOne({
    // $or: [{ email: email.toLowerCase() }, { mobile: mobile }],
    email: email.toLowerCase(),
  });

  // Throw error if user is found
  if (existedUser) {
    // throw new ApiError(409, "User with mobile number or email already exist!");
    throw new ApiError(409, "User with email already exist!");
  }

  // Create a new user
  const newUser = {
    name,
    // mobile,
    email: email.toLowerCase(), // Convert email to lowercase for case-insensitive matching
    password,
    gender: gender || undefined,
  };

  // Create Activation token
  const activationToken = jwt.sign(
    newUser,
    process.env.USER_ACTIVATION_SECRET,
    {
      expiresIn: "30m",
    }
  );

  // Create Activation token url
  const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}${queryString}`;

  await sendMail({
    email: newUser.email,
    subject: "Activate your account",
    message: `Hello ${newUser.name}, please click on the link to activate your account: ${activationUrl}`,
  });

  // Return a successful response with the information
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { token: activationToken, url: activationUrl },
        `Please check your email: ${newUser.email} to active your account!`
      )
    );
});
