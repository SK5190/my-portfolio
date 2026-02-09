import { Router } from 'express';
import { ContactSubmission } from '../models/ContactSubmission.js';
import { sendContactEmail } from '../utils/sendEmail.js';

const router = Router();

// POST /api/contact - submit contact form (saved to MongoDB + email to you)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const submission = await ContactSubmission.create({ name: name.trim(), email: email.trim(), message: message.trim() });

    const emailTo = process.env.CONTACT_EMAIL_TO;
    if (emailTo) {
      try {
        await sendContactEmail({
          to: emailTo,
          name: submission.name,
          email: submission.email,
          message: submission.message
        });
      } catch (emailErr) {
        console.error('Contact email send error:', emailErr.message);
      }
    }

    res.status(201).json({ success: true, id: submission._id });
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
