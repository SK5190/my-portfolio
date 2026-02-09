import { Router } from 'express';
import multer from 'multer';
import { Certificate } from '../models/Certificate.js';
import { getImageUrl } from '../utils/imageKit.js';
import { uploadToImageKit } from '../utils/uploadToImageKit.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// GET /api/certificates - list all certificates for gallery
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    const withImageUrls = certificates.map((c) => ({
      _id: c._id,
      title: c.title,
      description: c.description || '',
      image: getImageUrl(c.image),
      orientation: c.orientation || 'portrait'
    }));
    res.json(withImageUrls);
  } catch (err) {
    console.error('GET /api/certificates error:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// POST /api/certificates - add a certificate (multipart: image file + title)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const title = (req.body.title || '').trim() || 'Certificate';
    const description = (req.body.description || '').trim();
    const orientation = (req.body.orientation || 'portrait') === 'landscape' ? 'landscape' : 'portrait';

    const ext = file.originalname.split('.').pop() || 'jpg';
    const safeName = `cert-${Date.now()}.${ext}`;
    const { url } = await uploadToImageKit(file.buffer, safeName, 'certificates');

    const count = await Certificate.countDocuments();
    const cert = await Certificate.create({
      title,
      description,
      image: url,
      orientation,
      order: count
    });
    res.status(201).json({
      _id: cert._id,
      title: cert.title,
      description: cert.description || '',
      image: url,
      orientation: cert.orientation
    });
  } catch (err) {
    console.error('POST /api/certificates error:', err);
    if (err.message && err.message.includes('IMAGEKIT')) {
      return res.status(503).json({ error: 'Image upload not configured. Set ImageKit env vars.' });
    }
    res.status(500).json({ error: err.message || 'Failed to add certificate' });
  }
});

export default router;
