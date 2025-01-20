import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { ONE_Account } from "../../models/account.model.js";
import bcrypt from "bcrypt";
import { passwordChangedMail } from "../../EmailBody/passwordChangedMail.js";
import sendMail from "../../libs/sendMail.js";

// *** Reser Password ***
export const resetPassword = asyncHandler(async (req, res) => {
  // Extract accountId, token from request params
  const { accountId, token } = req.params;

  // Extract newPassword and queryString from request body
  const { newPassword, queryString } = req.body;

  // Decode the token
  const decodedToken = jwt.verify(token, "", { algorithms: ["none"] });

  // Find account with matching email or alternative email
  const existedAccount = await ONE_Account.findOne({
    _id: accountId,
    password: decodedToken.password,
  }).select("+password"); // Include the password field for comparison

  // Throw error if account is not found
  if (!existedAccount) {
    throw new ApiError(400, "Token is expired!");
  }

  // Hash the Password
  const hasedPassword = await bcrypt.hash(newPassword, 10);

  // Find account with matching email or alternative email
  const updatedAccount = await ONE_Account.findByIdAndUpdate(
    existedAccount._id,
    {
      password: hasedPassword,
    },
    { new: true }
  );

  // Throw error if account is not updated
  if (!updatedAccount) {
    throw new ApiError(400, "Something went wrong, Try again after sometime!");
  }

  // Generate login url
  const loginUrl = `${process.env.FRONTEND_URL}/login${
    queryString && `?${queryString}`
  }`;

  // Send Mail
  await sendMail({
    email: updatedAccount.email,
    subject: "Password Changed",
    messageHtml: passwordChangedMail(updatedAccount.name, loginUrl),
  });

  // Remove the role & password field from the Account object before sending response
  updatedAccount.role = undefined;
  updatedAccount.password = undefined;

  // Return a successful response with token
  return res.status(200).json(
    new ApiResponse(
      201,
      {
        // forgetPasswordToken: forgetPasswordToken,
        accountId: updatedAccount._id,
        email: updatedAccount.email,
      },
      `Password has been changed successfully, Kindly login now!`
    )
  );
});
