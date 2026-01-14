import nodemailer from 'nodemailer';
import config from '../config/config.js';

const clientUrl = config.clientUrl;

console.log(clientUrl);

export const sendEmail = async (email: string, html: string) => {
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
    const verifyUrl = `${clientUrl}/verify?token=${token}`;

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">

            <tr>
              <td style="padding:30px;text-align:center;">
                <h1 style="margin:0;color:#333;">Verify Your Email</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 30px 20px 30px;color:#555;font-size:16px;line-height:24px;">
                <p>Thanks for signing up! Please confirm your email address by clicking the button below.</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px;">
                <a href="${verifyUrl}"
                   style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;display:inline-block;">
                  Verify Email
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:0 30px 30px 30px;color:#777;font-size:14px;line-height:22px;">
                <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                <p style="word-break:break-all;color:#2563eb;">${verifyUrl}</p>
                <p>If you didn’t create an account, you can safely ignore this email.</p>
              </td>
            </tr>

            <tr>
              <td style="background:#f4f6f8;padding:15px;text-align:center;font-size:12px;color:#999;border-radius:0 0 8px 8px;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    await sendEmail(email, html);
  } catch (error) {
    throw error;
  }
};

export const sendForgetPasswordEmail = async (email: string, token: string) => {
  try {
    const resetUrl = `${clientUrl}/reset-password?reset=${token}`;

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">

            <tr>
              <td style="padding:30px;text-align:center;">
                <h1 style="margin:0;color:#333;">Reset Your Password</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 30px 20px 30px;color:#555;font-size:16px;line-height:24px;">
                <p>We received a request to reset your password. Click the button below to continue.</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px;">
                <a href="${resetUrl}"
                   style="background:#dc2626;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;display:inline-block;">
                  Reset Password
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:0 30px 30px 30px;color:#777;font-size:14px;line-height:22px;">
                <p>This link will expire soon for security reasons.</p>
                <p>If the button doesn’t work, copy and paste this link:</p>
                <p style="word-break:break-all;color:#dc2626;">${resetUrl}</p>
                <p>If you didn’t request a password reset, please ignore this email.</p>
              </td>
            </tr>

            <tr>
              <td style="background:#f4f6f8;padding:15px;text-align:center;font-size:12px;color:#999;border-radius:0 0 8px 8px;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    await sendEmail(email, html);
  } catch (error) {
    throw error;
  }
};

export const sendInvitationEmail = async (email: string, token: string, companyName: string, role: string) => {
  try {
    const inviteUrl = `${clientUrl}/invite/accept?token=${token}`;
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
