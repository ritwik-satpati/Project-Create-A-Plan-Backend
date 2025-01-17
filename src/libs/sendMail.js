import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";

const sendMail = async (options) => {
  // Create a transporter for sending emails
  const transporter = nodemailer.createTransport({
    // Email server configuration
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE || undefined,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // secure: process.env.SMTP_PORT == 465,
  });

  // Set up email options
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message || undefined,
    html: options.messageHtml || undefined,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send email. Please try again later.");
  }
};

export default sendMail;
