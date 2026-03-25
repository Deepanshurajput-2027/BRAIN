import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAuthToken } from "../services/auth.service.js";
import { sendEmail } from "../services/mail.service.js";
import crypto from "crypto";
import logger from "../utils/logger.js";

// ── Shared cookie options ─────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

// ── Register ──────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validate — no empty fields
  if ([username, email, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Check for duplicate user
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      existingUser.email === email.toLowerCase()
        ? "Email already registered"
        : "Username already taken"
    );
  }

  // 3. Create user (password is hashed in pre-save hook)
  const user = await User.create({ username, email, password });

  // 4. Return user without the password field
  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const token = await generateAuthToken(createdUser._id);

  logger.info(`[AUTH] User registered: ${createdUser.email}`);

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

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // Always explicitly select password for comparison
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) {
    logger.warn(`[AUTH] Failed login attempt for email/username: ${email || username} - User not found`);
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    logger.warn(`[AUTH] Failed login attempt for email: ${user.email} - Invalid credentials`);
    throw new ApiError(401, "Invalid credentials");
  }

  // 4. Check if verified
  if (!user.isVerified) {
    logger.warn(`[AUTH] Failed login attempt for email: ${user.email} - Email not verified`);
    throw new ApiError(401, "Please verify your email to login. Check your inbox.");
  }

  const token = await generateAuthToken(user._id);

  const loggedInUser = await User.findById(user._id);

  logger.info(`[AUTH] User logged in: ${loggedInUser.email}`);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser},
        "Logged in successfully"
      )
    );
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

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const updateFields = {};
  if (username) updateFields.username = username.toLowerCase();
  if (email) updateFields.email = email.toLowerCase();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateFields,
    },
    { new: true }
  ).select("-password");

  logger.info(`[AUTH] User account details updated for: ${user.email}`);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});
// ── Logout ──────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
  logger.info(`[AUTH] User logged out: ${req.user.email}`);
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ── Email Verification ───────────────────────────────────────────────────────
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = verificationToken;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const message = `Please click on the following link to verify your email address: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Email Verification",
      text: message,
    });
    logger.info(`[AUTH] Verification email sent to: ${user.email}`);
  } catch (error) {
    logger.error(`[AUTH] Error sending verification email to ${user.email}: ${error.message}`);
    throw new ApiError(500, "Email could not be sent");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Verification email sent"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    logger.warn(`[AUTH] Invalid verification token received`);
    throw new ApiError(400, "Invalid verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info(`[AUTH] User email verified: ${user.email}`);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

// ── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // For security, don't reveal if user exists.
    // Just return a success message either way.
    logger.info(`[AUTH] Password reset requested for non-existent or unverified email: ${email}`);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "If an account with that email exists, a reset link has been sent."));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // In a real app, this would be your frontend URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) have requested the reset of a password. \n\n Please click on the following link, or paste this into your browser to complete the process: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Token",
      text: message,
    });

    logger.info(`[AUTH] Password reset email sent to: ${email}`);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Reset link sent to email"));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(`[AUTH] Error sending reset email to ${email}: ${error.message}`);
    throw new ApiError(500, "Email could not be sent");
  }
});

// ── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

export { 
  registerUser, 
  loginUser, 
  logoutUser,
  getCurrentUser, 
  updateAccountDetails, 
  forgotPassword, 
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
