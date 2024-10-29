import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

export async function generateAndSendOtp(email: string) {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Email Verification",
    text: `Your OTP is ${otp}`,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
}