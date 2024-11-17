const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, validationErrorWithData } = require('../../utils/responseHandlers');
const User = require('../models/user');
const Session = require('../models/session');
const { jwtSecret } = require('../../configs/config');
const { sendOTPToEmail, sendOTPToPhone } = require('../../utils/otpService'); // You can create this utility later

// SignUp: Creates a new user
const signup = async (req, res) => {
  try {
    const { username, email, number, password } = req.body;

    if (!username || !email || !number || !password) {
      return validationErrorWithData(res, 'All fields are required', []);
    }

    const existingUser = await User.findOne({
      where: { email }
    });
    if (existingUser) {
      return validationErrorWithData(res, 'Email is already taken', []);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      number,
      password: hashedPassword,
      role: 2 // User role by default
    });

    successResponse(res, 'User signed up successfully');
  } catch (error) {
    console.error(error);
    errorResponse(res, 'Error signing up');
  }
};

// SignIn: Authenticates user via email and password
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return validationErrorWithData(res, 'Email and password are required', []);
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return errorResponse(res, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn: '1h',
    });

    successResponseWithData(res, 'User signed in successfully', { token });
  } catch (error) {
    console.error(error);
    errorResponse(res, 'Error signing in');
  }
};

// Forget Password: Send OTP via email or phone
const forgotPassword = async (req, res) => {
  const { email, number } = req.body;

  if (!email && !number) {
    return validationErrorWithData(res, 'Email or phone number is required', []);
  }

  if (email) {
    // Send OTP to email
    const otp = generateOTP();
    await sendOTPToEmail(email, otp);
  }

  if (number) {
    // Send OTP to phone
    const otp = generateOTP();
    await sendOTPToPhone(number, otp);
  }

  successResponse(res, 'OTP sent successfully');
};

// Reset Password: Verify OTP and reset password
const resetPassword = async (req, res) => {
  const { otp, newPassword, sessionId } = req.body;

  const session = await Session.findOne({ where: { session_id: sessionId } });
  if (!session) {
    return errorResponse(res, 'Invalid session');
  }

  if (session.session_otp !== otp) {
    return errorResponse(res, 'Invalid OTP');
  }

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: session.session_user_id } });
    successResponse(res, 'Password reset successfully');
  } else {
    errorResponse(res, 'New password is required');
  }
};

// Generate OTP (6-digit)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
};
