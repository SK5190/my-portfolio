import { Router } from 'express';
import multer from 'multer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Resume } from '../models/Resume.js';
import { uploadToImageKit, isImageKitConfigured } from '../utils/uploadToImageKit.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const router = Router();

// Use memory storage so we can send buffer to ImageKit or write to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF or Word documents are allowed'));
  }
});

// GET /api/resume — redirect to stored URL (ImageKit) or serve from disk (local fallback)
router.get('/', async (req, res) => {
  const doc = await Resume.findOne().sort({ updatedAt: -1 }).lean();
  if (doc?.url) {
    return res.redirect(doc.url);
  }
  const names = ['resume.pdf', 'resume.doc', 'resume.docx'];
  for (const name of names) {
    const path = join(UPLOADS_DIR, name);
    if (fs.existsSync(path)) {
      return res.download(path, name);
    }
  }
  res.status(404).json({ error: 'Resume not uploaded yet' });
});

function removeOtherResumesFromDisk(keepFilename) {
  const names = ['resume.pdf', 'resume.doc', 'resume.docx'];
  names.forEach((name) => {
    if (name !== keepFilename) {
      const path = join(UPLOADS_DIR, name);
      if (fs.existsSync(path)) fs.unlinkSync(path);
    }
  });
}

// POST /api/resume — upload to ImageKit (persistent) when configured, else save to disk
router.post('/', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 10MB)' });
      }
      return res.status(400).json({ error: err.message || 'Invalid file' });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'Resume file is required' });
  }

  if (isImageKitConfigured()) {
    try {
      const ext = (req.file.originalname.split('.').pop() || 'pdf').toLowerCase();
      const allowed = ['pdf', 'doc', 'docx'];
      const fileName = allowed.includes(ext) ? `resume.${ext}` : 'resume.pdf';
      const { url } = await uploadToImageKit(req.file.buffer, fileName, 'resume');
      await Resume.findOneAndUpdate(
        {},
        { url },
        { upsert: true, new: true }
      );
      return res.status(201).json({ message: 'Resume updated successfully', url });
    } catch (err) {
      console.error('Resume ImageKit upload error:', err.message);
      return res.status(500).json({ error: 'Failed to upload resume' });
    }
  }

  const ext = (req.file.originalname.split('.').pop() || 'pdf').toLowerCase();
  const allowed = ['pdf', 'doc', 'docx'];
  const filename = allowed.includes(ext) ? `resume.${ext}` : 'resume.pdf';
  const path = join(UPLOADS_DIR, filename);
  fs.writeFileSync(path, req.file.buffer);
  removeOtherResumesFromDisk(filename);
  res.status(201).json({ message: 'Resume updated successfully', filename });
});

export default router;
