import nodemailer from 'nodemailer';

let transporter = null;

export function isEmailConfigured() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_EMAIL_TO;
  return Boolean(host && user && pass && to);
}

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
  return transporter;
}

/**
 * Verify SMTP connection on startup.
 */
export async function verifyEmailTransport() {
  const transport = getTransporter();
  if (!transport) return false;
  await transport.verify();
  return true;
}

/**
 * Send contact form submission to your email.
 * @param {{ to: string, name: string, email: string, message: string }} options
 * @returns {Promise<boolean>} true if sent, false if email not configured
 */
export async function sendContactEmail({ to, name, email, message }) {
  const transport = getTransporter();
  if (!transport || !to) return false;
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: email,
    subject: `Portfolio contact: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `
  });
  return true;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
