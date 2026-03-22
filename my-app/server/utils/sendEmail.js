import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter (The "Post Office")
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your App Password (not your login pass)
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `MediQuick+ <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // Using HTML for a professional look
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;