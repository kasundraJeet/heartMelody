const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorWithData,
} = require("../utils/responseHandlers");
const { errorLog, successLog } = require("../utils/logger");
const dotenv = require("dotenv");

dotenv.config();

const sendOtp = (contactMethod, otp) => {
  console.log(`Sending OTP ${otp} to ${contactMethod}`);
};

const signup = async (req, res) => {
  const { username, email, password, number } = req.body;
  try {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      number,
    });
    successLog.info(`User signed up: ${email}`);
    return successResponse(res, "User registered successfully");
  } catch (error) {
    errorLog.error(error.message);
    return errorResponse(res, "Signup failed");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== hashedPassword) {
      return unauthorizedResponse(res, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.last_login = new Date();
    await user.save();

    successLog.info(`User logged in: ${email}`);
    return successResponse(res, { token, message: "Login successful" });
  } catch (error) {
    errorLog.error(error.message);
    return errorResponse(res, "Login failed");
  }
};

const forgotPassword = async (req, res) => {
  const { email, number } = req.body;
  try {
    const user = email
      ? await User.findOne({ where: { email } })
      : await User.findOne({ where: { number } });

    if (!user)
      return validationErrorWithData(res, "User not found", { email, number });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.password_reset_token = otp;
    user.token_expiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    sendOtp(email || number, otp);
    successLog.info(`OTP sent to ${email || number}`);
    return successResponse(res, "OTP sent successfully");
  } catch (error) {
    errorLog.error(error.message);
    return errorResponse(res, "Failed to send OTP");
  }
};

const verifyOtp = async (req, res) => {
  const { email, number, otp } = req.body;
  try {
    const user = email
      ? await User.findOne({ where: { email } })
      : await User.findOne({ where: { number } });

    if (!user)
      return validationErrorWithData(res, "User not found", { email, number });

    if (
      user.password_reset_token !== otp ||
      new Date() > new Date(user.token_expiry)
    ) {
      return validationErrorWithData(res, "Invalid or expired OTP", { otp });
    }

    successLog.info(`OTP verified for ${email || number}`);
    return successResponse(res, "OTP verified successfully");
  } catch (error) {
    errorLog.error(error.message);
    return errorResponse(res, "Failed to verify OTP");
  }
};

const resetPassword = async (req, res) => {
  const { email, number, newPassword } = req.body;
  try {
    const user = email
      ? await User.findOne({ where: { email } })
      : await User.findOne({ where: { number } });

    if (!user)
      return validationErrorWithData(res, "User not found", { email, number });

    user.password = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");
    user.password_reset_token = null;
    user.token_expiry = null;
    await user.save();

    successLog.info(`Password reset successful for ${email || number}`);
    return successResponse(res, "Password reset successful");
  } catch (error) {
    errorLog.error(error.message);
    return errorResponse(res, "Failed to reset password");
  }
};

const googleLoginSuccess = (req, res) => {
    const user = req.user;
    successLog.info(`Google login successful for user: ${user.email}`);
    return successResponse(res, 'Google login successful', { user });
};

const facebookLoginSuccess = (req, res) => {
    const user = req.user;
    successLog.info(`Facebook login successful for user: ${user.email}`);
    return successResponse(res, 'Facebook login successful', { user });
};

module.exports = { signup, login, forgotPassword, verifyOtp, resetPassword , facebookLoginSuccess , googleLoginSuccess };
