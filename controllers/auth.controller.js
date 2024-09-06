import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/user.model.js";

// JWT TOKEN
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    token,
  });
};

// REGISTER
export const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // Check for existing user
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new ErrorResponse("Email is already registered", 400));
    }
    const user = await User.create({ username, email, password });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};
export const loginController = async (req, res, next) => {
  const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken(res);
    res.status(statusCode).json({ success: true, token });
  };

  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return next(new ErrorResponse("Please provide email and password", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logoutController = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
