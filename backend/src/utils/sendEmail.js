const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured in .env');
  }

  await resend.emails.send({
    from: 'iRabiesCare <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;