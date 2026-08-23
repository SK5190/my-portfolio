import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import express from 'express';

// Load .env from backend folder (works when run from project root or from backend)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
import cors from 'cors';
import { connectDB } from './config/db.js';
import { isEmailConfigured, verifyEmailTransport, getEmailProviderName } from './utils/sendEmail.js';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';
import certificatesRouter from './routes/certificates.js';
import resumeRouter from './routes/resume.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function normalizeOrigin(url) {
  return url.trim().replace(/\/$/, '');
}

// Comma-separated: e.g. http://localhost:5173,https://your-app.vercel.app
const allowedOrigins = FRONTEND_URL.split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

const corsOrigin = (origin, cb) => {
  // Same-origin requests, server tools, curl — no Origin header
  if (!origin) return cb(null, true);

  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalized)) {
    return cb(null, origin);
  }

  // Convenience for local dev when FRONTEND_URL only lists production
  if (process.env.NODE_ENV !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(normalized)) {
    return cb(null, origin);
  }

  console.warn(`CORS blocked origin: ${origin} (allowed: ${allowedOrigins.join(', ')})`);
  return cb(new Error('Not allowed by CORS'));
};

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/resume', resumeRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

connectDB().then(async () => {
  if (isEmailConfigured()) {
    try {
      await verifyEmailTransport();
      const provider = getEmailProviderName();
      console.log(`Email: ${provider} transport ready`);
    } catch (err) {
      console.error('Email transport verification failed —', err.message);
    }
  } else {
    console.warn('Email: not configured — set RESEND_API_KEY and CONTACT_EMAIL_TO');
  }
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
