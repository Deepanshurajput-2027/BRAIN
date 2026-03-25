import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * generateAuthToken
 * ---------------------
 * 1. Fetches the user by ID
 * 2. Generates a single JWT token
 * 3. Returns the token
 *
 * @param {string} userId
 * @returns {Promise<string>}
 */
export const generateAuthToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = user.generateToken();

    return token;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating token",
      [error.message]
    );
  }
};
