import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { supportedMailDomain } from "../../constants/supportedMailDomain.js";
import jwt from "jsonwebtoken";
import sendMail from "../../libs/sendMail.js";
import { ONE_Account } from "../../models/account.model.js";
import { activateYourAccountMail } from "../../EmailBody/activateYourAccountMail.js";

// *** User Registration ***
export const registerUser = asyncHandler(async (req, res) => {
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

  // Check for existing account with various identifiers
  const existedAccount = await ONE_Account.findOne({
    // $or: [{ email: email.toLowerCase() }, { mobile: mobile }],
    email: email.toLowerCase(),
  });

  // Throw error if account is found
  if (existedAccount) {
    // throw new ApiError(409, "Account with mobile number or email already exist!");
    throw new ApiError(409, "Account with email already exist, Kindly Login!");
  }

  // Create a new Account
  const newAccount = {
    name,
    // mobile,
    email: email.toLowerCase(), // Convert email to lowercase for case-insensitive matching
    password,
    gender: gender || undefined,
  };

  // Create Activation token
  const activationToken = jwt.sign(
    newAccount,
    process.env.ACCOUNT_ACTIVATION_SECRET,
    {
      expiresIn: "30m",
    }
  );

  // Create Activation token url
  const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}${queryString}`;

  // Send Mail
  await sendMail({
    email: newAccount.email,
    subject: "Activate your account",
    // message: `Hello ${newAccount.name}, please click on the link to activate your account: ${activationUrl}`,
    messageHtml: activateYourAccountMail(newAccount.name, activationUrl),
  });

  // Return a successful response with the information
  return res.status(201).json(
    new ApiResponse(
      201,
      // { token: activationToken, url: activationUrl },
      `Please check your email: ${newAccount.email} to active your account!`
    )
  );
});
