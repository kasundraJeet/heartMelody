const nodemailer = require('nodemailer');
const twilio = require('twilio');

const sendOTPToEmail = async (email, otp) => {
  // Implement email sending via Nodemailer
};

const sendOTPToPhone = async (phoneNumber, otp) => {
  // Implement SMS sending via Twilio or any other SMS service
};

module.exports = {
  sendOTPToEmail,
  sendOTPToPhone,
};
