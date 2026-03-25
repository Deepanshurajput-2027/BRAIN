import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAuthToken } from "../services/auth.service.js";

// ── Shared cookie options ─────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

// ── Register ──────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({ username, email, password });
  const createdUser = await User.findById(user._id).select("-password");

  const token = await generateAuthToken(createdUser._id);

  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(201, { user: createdUser }, "User registered successfully"));
});

// ── Login ─────────────────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = await generateAuthToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Logged in successfully"));
});

// ── Current User ─────────────────────────────────────────────────────────────
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// ── Update Account Details ───────────────────────────────────────────────────
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { username, email } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// ── Logout ──────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { 
  registerUser, 
  loginUser, 
  logoutUser,
  getCurrentUser, 
  updateAccountDetails
};
