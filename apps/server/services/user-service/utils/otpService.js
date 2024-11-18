require("dotenv").config();
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const sendOTPToEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to email: ${email}`);
  } catch (error) {
    console.error(
      `Error sending OTP to email: ${email}. Error: ${error.message}`
    );
    throw error;
  }
};

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
// const client = twilio(accountSid, authToken);
const client = null;

const sendOTPToPhone = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}. It is valid for 15 minutes.`,
      from: "+916351829893",
      to: phoneNumber,
    });

    console.log(
      `OTP sent to phone: ${phoneNumber}, Message SID: ${message.sid}`
    );
  } catch (error) {
    console.error(
      `Error sending OTP to phone: ${phoneNumber}. Error: ${error.message}`
    );
    throw error;
  }
};

module.exports = {
  sendOTPToEmail,
  sendOTPToPhone,
};
