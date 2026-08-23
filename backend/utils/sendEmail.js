import nodemailer from 'nodemailer';

let transporter = null;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailContent({ name, email, message }) {
  return {
    subject: `Portfolio contact: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `
  };
}

function getEmailProvider() {
  if (process.env.RESEND_API_KEY?.trim()) return 'resend';
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp';
  return null;
}

export function isEmailConfigured() {
  const to = process.env.CONTACT_EMAIL_TO?.trim();
  if (!to) return false;
  return getEmailProvider() !== null;
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

async function sendViaSmtp({ to, name, email, message }) {
  const transport = getTransporter();
  if (!transport) return false;
  const content = buildEmailContent({ name, email, message });
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: email,
    ...content
  });
  return true;
}

/**
 * Resend uses HTTPS (port 443) — works on Render free tier where SMTP ports are blocked.
 * https://resend.com/docs/api-reference/emails/send-email
 */
async function sendViaResend({ to, name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const from = process.env.EMAIL_FROM?.trim() || 'Portfolio Contact <onboarding@resend.dev>';
  const content = buildEmailContent({ name, email, message });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: content.subject,
      html: content.html,
      text: content.text
    })
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.message || body?.error || res.statusText;
    throw new Error(`Resend API error (${res.status}): ${detail}`);
  }

  return true;
}

/**
 * Verify email transport on startup.
 */
export async function verifyEmailTransport() {
  const provider = getEmailProvider();
  if (provider === 'smtp') {
    const transport = getTransporter();
    if (!transport) return false;
    await transport.verify();
    return true;
  }
  if (provider === 'resend') {
    // Resend has no verify endpoint; a valid API key format is enough for startup.
    return Boolean(process.env.RESEND_API_KEY?.startsWith('re_'));
  }
  return false;
}

export function getEmailProviderName() {
  return getEmailProvider();
}

/**
 * Send contact form submission to your email.
 * Prefers Resend (HTTPS) when RESEND_API_KEY is set — required for Render free tier.
 * Falls back to Nodemailer SMTP for local development.
 */
export async function sendContactEmail({ to, name, email, message }) {
  if (!to) return false;

  const provider = getEmailProvider();
  if (provider === 'resend') {
    return sendViaResend({ to, name, email, message });
  }
  if (provider === 'smtp') {
    return sendViaSmtp({ to, name, email, message });
  }
  return false;
}
