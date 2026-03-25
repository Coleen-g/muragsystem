const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('EMAIL_USER or EMAIL_PASS not set. Forgot password email will not be sent.');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,          // ✅ changed from default 587 to 465
  secure: true,       // ✅ must be true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASS in .env');
  }

  await transporter.sendMail({
    from: `"iRabiesCare" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;