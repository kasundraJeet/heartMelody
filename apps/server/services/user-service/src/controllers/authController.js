const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  successResponse,
  errorResponse,
  validationErrorWithData,
} = require("../../utils/responseHandlers");
const User = require("../models/user");
const Session = require("../models/session");
const { jwtSecret } = require("../../configs/config");
const { sendOTPToEmail, sendOTPToPhone } = require("../../utils/otpService");
const { errorLog, successLog } = require("../../utils/logger");


const signup = async (req, res) => {
  try {
    const { username, email, number, password } = req.body;

    if (!username || !email || !number || !password) {
      errorLog.error("SignUp: Missing required fields");
      return validationErrorWithData(res, "All fields are required", []);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      errorLog.error(`SignUp: User with email ${email} already exists`);
      return validationErrorWithData(res, "Email is already taken", []);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      number,
      password: hashedPassword,
      role: 2, // User role by default
    });

    successLog.info(`SignUp: User ${username} signed up successfully`);
    successResponse(res, "User signed up successfully");
  } catch (error) {
    errorLog.error(`SignUp Error: ${error.message}`);
    errorResponse(res, "Error signing up");
  }
};

// SignIn: Authenticates user via email and password
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      errorLog.error("SignIn: Missing email or password");
      return validationErrorWithData(
        res,
        "Email and password are required",
        []
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      errorLog.error(`SignIn: User with email ${email} not found`);
      return errorResponse(res, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errorLog.error("SignIn: Invalid credentials");
      return errorResponse(res, "Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });

    successLog.info(`SignIn: User ${email} signed in successfully`);
    successResponseWithData(res, "User signed in successfully", { token });
  } catch (error) {
    errorLog.error(`SignIn Error: ${error.message}`);
    errorResponse(res, "Error signing in");
  }
};

// Forget Password: Send OTP via email or phone
const forgotPassword = async (req, res) => {
  try {
    const { email, number } = req.body;

    if (!email && !number) {
      errorLog.error("ForgotPassword: Missing email or phone number");
      return validationErrorWithData(
        res,
        "Email or phone number is required",
        []
      );
    }

    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
      if (!user) {
        errorLog.error(`ForgotPassword: User with email ${email} not found`);
        return errorResponse(res, "User not found");
      }
    } else if (number) {
      user = await User.findOne({ where: { number } });
      if (!user) {
        errorLog.error(`ForgotPassword: User with number ${number} not found`);
        return errorResponse(res, "User not found");
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    // Save OTP and details to the Session table
    const sessionId = `session_${user.id}_${Date.now()}`; // Unique session ID
    await Session.create({
      session_id: sessionId,
      session_email: user.email,
      session_token: null,
      session_expires_at: otpExpiry,
      session_user_id: user.id,
      session_user_role: user.role,
      user_fcm_token: user.fcm,
      user_last_login: user.last_login,
      session_otp: otp,
      session_otp_expires_at: otpExpiry,
      password: user.password,
      session_is_verified: false,
    });

    // Send OTP via Email or Phone
    if (email) {
      await sendOTPToEmail(email, otp);
      successLog.info(`ForgotPassword: OTP sent to email ${email}`);
    } else if (number) {
      await sendOTPToPhone(number, otp);
      successLog.info(`ForgotPassword: OTP sent to phone number ${number}`);
    }

    successResponse(res, "OTP sent successfully");
  } catch (error) {
    errorLog.error(`ForgotPassword Error: ${error.message}`);
    errorResponse(res, "Error sending OTP");
  }
};

// Reset Password: Verify OTP and reset password
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, sessionId } = req.body;

    const session = await Session.findOne({ where: { session_id: sessionId } });
    if (!session) {
      errorLog.error(`ResetPassword: Invalid session ID ${sessionId}`);
      return errorResponse(res, "Invalid session");
    }

    if (session.session_otp !== otp) {
      errorLog.error(`ResetPassword: Invalid OTP for session ID ${sessionId}`);
      return errorResponse(res, "Invalid OTP");
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { password: hashedPassword },
        { where: { id: session.session_user_id } }
      );
      successLog.info(
        `ResetPassword: Password reset successfully for user ${session.session_email}`
      );
      successResponse(res, "Password reset successfully");
    } else {
      errorLog.error("ResetPassword: New password is required");
      errorResponse(res, "New password is required");
    }
  } catch (error) {
    errorLog.error(`ResetPassword Error: ${error.message}`);
    errorResponse(res, "Error resetting password");
  }
};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  successLog.info(`Generated OTP: ${otp}`);
  return otp;
};

module.exports = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
};
