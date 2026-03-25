import nodemailer from "nodemailer";

/**
 * createTransporter
 * -----------------
 * Configures the mail transporter. In production, use real SMTP credentials.
 */
const createTransporter = () => {
  // In development, you can use ethereal.email or just log to console
  // For Vercel/Production, these ENV vars must be set
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * sendEmail
 * ---------
 * Generic function to send an email.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: '"BRAIN Team" <noreply@brainapp.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // In a real app, we might not want to throw if email fails, 
    // but for verification/reset it's critical.
    throw error;
  }
};
