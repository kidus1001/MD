import "dotenv/config";
import nodemailer from "nodemailer";

export default async function sendVerificationEmail(to, name, token) {
  // Create the transporter with Gmail settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false, // true for 465, false for other ports (587 uses STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyURL = `${process.env.APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Mezmur Debter" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email address",
    html: `
      <h1>Hello ${name}</h1>
      <p>Click the link below to verify your email address.</p>
      <p><a href="${verifyURL}">Verify Email</a></p>
      <p>This link expires in 2 hours.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  return info;
}
