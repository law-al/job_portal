import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const sendEmail = async (email: string, html: string) => {
  console.log('++++++++++++++++++++++++++++++++=Entreed');
  const transporter = nodemailer.createTransport({
    host: config.smptHost,
    port: 2525,
    auth: {
      user: config.smptUser,
      pass: config.smptPass,
    },
  });

  await transporter.sendMail({
    from: 'no-reply@jobportal.com>',
    to: email,
    subject: 'Verify your account',
    html,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const verifyUrl = `http://localhost:3001/verify?token=${token}`;
    const html = `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`;

    await sendEmail(email, html);
  } catch (error) {
    throw error;
  }
};

export const sendForgetPasswordEmail = async (email: string, token: string) => {
  try {
    const verifyUrl = `http://localhost:3001/reset-password?reset=${token}`;
    const html = `<p>Click to change password: <a href="${verifyUrl}">${verifyUrl}</a></p>`;

    await sendEmail(email, html);
  } catch (error) {
    throw error;
  }
};

export const sendInvitationEmail = async (email: string, token: string, companyName: string, role: string) => {
  try {
    const inviteUrl = `http://localhost:5000/invite/accept?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited to join ${companyName}</h2>
        <p>You have been invited to join <strong>${companyName}</strong> as a <strong>${role}</strong>.</p>
        <p>Click the link below to accept the invitation:</p>
        <p>
          <a href="${inviteUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Accept Invitation
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${inviteUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: config.smptHost,
      port: 2525,
      auth: {
        user: config.smptUser,
        pass: config.smptPass,
      },
    });

    await transporter.sendMail({
      from: 'no-reply@jobportal.com',
      to: email,
      subject: `Invitation to join ${companyName}`,
      html,
    });
  } catch (error) {
    throw error;
  }
};
