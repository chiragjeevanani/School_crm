import nodemailer from 'nodemailer';
import { env } from './env.js';

export function isSmtpConfigured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function transporter() {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: Number(env.smtp.port) === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendSchoolWelcomeEmail({ to, schoolName, password, loginUrl }) {
  const subject = `${schoolName} — your School Admin login`;
  const text = [
    `Welcome to ${schoolName}.`,
    '',
    'Your School Admin portal login:',
    `Email: ${to}`,
    `Password: ${password}`,
    `Login: ${loginUrl}`,
    '',
    'After login, choose a subscription plan to unlock the rest of the portal.',
    'Please change this password after you sign in.',
  ].join('\n');

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <h2 style="margin-bottom:8px">${schoolName}</h2>
      <p>Your School Admin account is ready.</p>
      <p><strong>Email:</strong> ${to}<br/><strong>Password:</strong> ${password}</p>
      <p><a href="${loginUrl}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px">Open School Admin login</a></p>
      <p style="color:#64748b;font-size:13px">After login, choose a subscription plan to unlock the rest of the portal.</p>
    </div>
  `;

  if (!isSmtpConfigured()) {
    if (env.nodeEnv !== 'production') {
      console.log(`[dev email] To: ${to}\n${text}`);
    }
    return false;
  }

  await transporter().sendMail({
    from: env.smtp.from || env.smtp.user,
    to,
    subject,
    text,
    html,
  });

  return true;
}
