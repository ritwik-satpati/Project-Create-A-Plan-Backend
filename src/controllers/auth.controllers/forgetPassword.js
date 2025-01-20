import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ONE_Account } from "../../models/account.model.js";
import { resetYourPasswordMail } from "../../EmailBody/resetYourPasswordMail.js";
import sendMail from "../../libs/sendMail.js";

// *** Forget Password ***
export const forgetPassword = asyncHandler(async (req, res) => {
  // Extract email & queryString from request body
  const { email, queryString } = req.body;

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

  // Generate an forget password token for the user (implementation from Account model method)
  const forgetPasswordToken = await existedAccount.forgetPasswordToken();

  // Set new addedQuery
  const addedQuery = `email=${encodeURIComponent(
    existedAccount.email
  )}&&uid=${encodeURIComponent(existedAccount._id)}&&token=${encodeURIComponent(
    forgetPasswordToken
  )}`;

  // Generate forget password url
  const forgetPasswordUrl = queryString
    ? `${process.env.FRONTEND_URL}/forget-password${queryString}&&${addedQuery}`
    : `${process.env.FRONTEND_URL}/forget-password?${addedQuery}`;

  // Send Mail
  await sendMail({
    email: existedAccount.email,
    subject: "Reset your password",
    // message: `Hello ${existedAccount.name}, please click on the link to activate your account: ${activationUrl}`,
    messageHtml: resetYourPasswordMail(existedAccount.name, forgetPasswordUrl),
  });

  // Remove the role & password field from the Account object before sending response
  existedAccount.role = undefined;
  existedAccount.password = undefined;

  // Return a successful response with token
  return res.status(200).json(
    new ApiResponse(
      201,
      {
        // forgetPasswordToken: forgetPasswordToken,
        // accountId: existedAccount._id,
        // email: existedAccount.email,
      },
      `Please check your email: ${existedAccount.email} to reset your account password!`
    )
  );
});
