import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * verifyJWT
 * ---------
 * 1. Extracts the Token from cookies or Authorization header
 * 2. Verifies the token using JWT_SECRET
 * 3. Fetches the user (excluding password) and attaches to req.user
 * 4. Throws 401 ApiError if the token is missing, invalid, or expired
 */
export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized — no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    throw new ApiError(401, "Invalid access token — user not found");
  }

  req.user = user;
  next();
});
