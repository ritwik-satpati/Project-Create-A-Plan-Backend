import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";

// *** User Registration ***
export const registerUser = asyncHandler(async (req, res) => {
    // Extract user information from request body
    const { name, mobile, email, password, gender } = req.body;

    // Check for existing user with various identifiers
    const existedUser = await User.findOne({
        $or: [{ email: email }, { mobile: mobile }],
    });
    if (existedUser) {
        throw new ApiError(409, "User with mobile number or email already exist!");
    }

    // Create a new user
    const createdUser = await User.create({
        name,
        mobile,
        email: email.toLowerCase(), // Convert email to lowercase for case-insensitive matching
        password,
        gender: gender || undefined,
    });

    // Remove the password field from the user object before sending response
    createdUser.password = undefined;

    // Return a successful response with the created user information
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { user: createdUser },
                "User is registed successfully"
            )
        );
});
