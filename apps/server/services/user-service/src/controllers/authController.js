const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  successResponse,
  errorResponse,
  validationErrorWithData,
  successResponseWithData,
} = require("../../utils/responseHandlers");
const User = require("../models/user");
const Session = require("../models/session");
const { jwtSecret, admin } = require("../../configs/config");
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

    const existingNumber = await User.findOne({ where: { number } });
    if (existingNumber) {
      errorLog.error(`SignUp: User with number ${number} already exists`);
      return validationErrorWithData(res, "number is already use", []);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      number,
      password: hashedPassword,
      role: 2,
    });

    successLog.info(`SignUp: User ${username} signed up successfully`);
    successResponse(res, "User signed up successfully");
  } catch (error) {
    errorLog.error(`SignUp Error: ${error.message}`);
    errorResponse(res, "Error signing up");
  }
};




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

    let user;
    let isAdmin = false;

    if (email === admin.email && password === admin.pass) {
      isAdmin = true;
      user = {
        id: 0,
        username: "Admin",
        email: admin.email,
        role: 1,
      };
    } else {
      user = await User.findOne({ where: { email } });
      if (!user) {
        errorLog.error(`SignIn: User with email ${email} not found`);
        return errorResponse(res, "User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errorLog.error("SignIn: Invalid credentials");
        return errorResponse(res, "Invalid credentials");
      }
    }

    const token = jwt.sign(
      { userId: user.id, role: isAdmin ? 1 : user.role },
      jwtSecret,
      { expiresIn: "1h" }
    );

    const sessionId = `session_${user.id}_${Date.now()}`;
    const sessionExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

    if (!isAdmin) {
      await Session.create({
        session_id: sessionId,
        session_email: user.email,
        session_token: token,
        session_expires_at: sessionExpiry,
        session_user_id: user.id,
        session_user_role: user.role,
        user_fcm_token: user.fcm,
        user_last_login: user.last_login,
        password: user.password,
        session_is_verified: true,
      });

      await User.update({ last_login: new Date() }, { where: { id: user.id } });
    }

    successLog.info(
      `SignIn: User ${isAdmin ? "Admin" : user.email} signed in successfully`
    );
    return successResponseWithData(res, "User signed in successfully", {
      token,
      sessionId: isAdmin ? null : sessionId,
      role: isAdmin ? 1 : user.role,
    });
  } catch (error) {
    errorLog.error(`SignIn Error: ${error.message}`);
    return errorResponse(res, "Error signing in");
  }
};

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

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const sessionId = `session_${user.id}_${Date.now()}`;
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

const googleLoginCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
    expiresIn: "1h",
  });

  // Redirect to frontend with token or send token in response
  res.redirect(`/google-success?token=${token}`);
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
  googleLoginCallback
};
