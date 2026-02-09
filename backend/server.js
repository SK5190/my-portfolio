import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import express from 'express';

// Load .env from backend folder (works when run from project root or from backend)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
import cors from 'cors';
import { connectDB } from './config/db.js';
import projectsRouter from './routes/projects.js';
import contactRouter from './routes/contact.js';
import certificatesRouter from './routes/certificates.js';
import resumeRouter from './routes/resume.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/resume', resumeRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
