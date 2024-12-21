// Import necessary libraries
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the Account schema
const accountSchema = new Schema(
  {
    // Indicates the type of account (personal or brand)
    type: {
      type: String,
      enum: ["personal", "business"],
      default: "personal",
    },
    // Name of the account holder
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Email address of the account holder (unique).
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Primary mobile number (unique)
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // WhatsApp number (unique)
    whatsapp: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    // Cloudinary public_id, url of the profile picture
    avatar: {
      id: {
        type: String,
      },
      url: {
        type: String,
      },
      service: {
        type: String,
      },
    },
    // Gender of the account holder (optional) for "personal" type account
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    // Hashed password for authentication
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
    },
    // Array of objects representing roles assigned to the account
    role: {
      type: [
        {
          // Name of the role
          name: {
            type: String,
          },
          // Unique user identifier in the specific schemas depen on role
          id: {
            type: mongoose.Schema.Types.ObjectId,
          },
          // Refresh token for JWT authentication used for Session based login
          roleToken: {
            type: String,
          },
          // Indicates if the role is currently active or not
          isActive: {
            type: Boolean,
            default: true,
          },
        },
      ],
      _id: false,
      // select: false,
      // required: false,
    },
  },
  {
    // Automatic timestamps for creation and updates
    timestamps: true,
  }
);

// Pre-save middleware to hash the password before saving it to the database.
accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    // Hash the password with bcrypt
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Method to check if the provided password is correct
accountSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// // Method to generate a verification token for authentication
// accountSchema.methods.generateVerificationToken = async function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCOUNT_VERIFICATION_TOKEN_EXPIRY,
//     }
//   );
// };

// Method to generate an access token for authentication
accountSchema.methods.generateAccessToken = async function () {
  // Ensure the token secret and expiry are set
  if (
    !process.env.ACCOUNT_ACCESS_TOKEN_SECRET ||
    !process.env.ACCOUNT_ACCESS_TOKEN_EXPIRY
  ) {
    throw new Error("Token secret or expiry not defined");
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCOUNT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCOUNT_ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Export the Account model
export const ONE_Account = mongoose.model("ONE_Account", accountSchema);
