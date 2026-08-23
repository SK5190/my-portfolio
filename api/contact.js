import { sendContactEmail, isEmailConfigured } from '../backend/utils/sendEmail.js';
import { connectDB } from '../backend/config/dbServerless.js';
import { ContactSubmission } from '../backend/models/ContactSubmission.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setCors(res, origin) {
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body ?? {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    if (!isEmailConfigured()) {
      console.error('Contact API: SMTP env vars missing on deployment host');
      return res.status(503).json({
        error: 'Email service is not configured on the server. Add SMTP_HOST, SMTP_USER, SMTP_PASS, and CONTACT_EMAIL_TO in your deployment environment variables.',
      });
    }

    const emailTo = process.env.CONTACT_EMAIL_TO.trim();
    let emailSent = false;

    try {
      emailSent = await sendContactEmail({ to: emailTo, ...payload });
    } catch (emailErr) {
      console.error('Contact email send error:', emailErr.message);
      return res.status(502).json({ error: 'Failed to send email. Please try again later.' });
    }

    if (process.env.MONGODB_URI) {
      try {
        await connectDB();
        await ContactSubmission.create(payload);
      } catch (dbErr) {
        console.error('Contact MongoDB save error:', dbErr.message);
      }
    }

    return res.status(201).json({ success: true, emailSent });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Failed to submit message' });
  }
}
