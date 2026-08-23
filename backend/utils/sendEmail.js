import { buildOwnerNotificationEmail } from './emailTemplates.js';

export function isEmailConfigured() {
  const to = process.env.CONTACT_EMAIL_TO?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return Boolean(to && apiKey);
}

export async function verifyEmailTransport() {
  return Boolean(process.env.RESEND_API_KEY?.startsWith('re_'));
}

export function getEmailProviderName() {
  return isEmailConfigured() ? 'resend' : null;
}

async function sendViaResend({ to, replyTo, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const from = process.env.EMAIL_FROM?.trim() || 'Portfolio Contact <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
      text
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
 * Notify portfolio owner of a new contact submission.
 */
export async function sendContactEmail({ to, name, email, message }) {
  if (!to) return false;
  const content = buildOwnerNotificationEmail({ name, email, message });
  return sendViaResend({
    to,
    replyTo: email,
    ...content
  });
}
