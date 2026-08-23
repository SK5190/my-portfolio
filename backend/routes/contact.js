import { Router } from 'express';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { isEmailConfigured, sendContactEmail } from '../utils/sendEmail.js';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - submit contact form (saved to MongoDB + email via Nodemailer)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const submission = await ContactSubmission.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    let emailSent = false;
    const emailTo = process.env.CONTACT_EMAIL_TO;
    if (emailTo && isEmailConfigured()) {
      try {
        emailSent = await sendContactEmail({
          to: emailTo,
          name: submission.name,
          email: submission.email,
          message: submission.message
        });
      } catch (emailErr) {
        console.error('Contact email send error:', emailErr.message);
        return res.status(502).json({ error: 'Message saved but email could not be sent. Please try again later.' });
      }
    } else if (!isEmailConfigured()) {
      console.warn('Contact form: SMTP not configured — set SMTP_* and CONTACT_EMAIL_TO in backend/.env');
    }

    res.status(201).json({ success: true, id: submission._id, emailSent });
  } catch (err) {
    console.error('POST /api/contact error:', err);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// GET /api/contact - list all submissions (for you to view). Optional: set ADMIN_SECRET in .env and pass ?secret=YOUR_SECRET
router.get('/', async (req, res) => {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (adminSecret && req.query.secret !== adminSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const submissions = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(submissions.map((s) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      message: s.message,
      createdAt: s.createdAt
    })));
  } catch (err) {
    console.error('GET /api/contact error:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
