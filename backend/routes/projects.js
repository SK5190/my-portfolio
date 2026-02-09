import { Router } from 'express';
import multer from 'multer';
import { Project } from '../models/Project.js';
import { getImageUrl } from '../utils/imageKit.js';
import { uploadToImageKit } from '../utils/uploadToImageKit.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// GET /api/projects - list all projects for Featured work (ordered by order then createdAt)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    const withImageUrls = projects.map((p) => ({
      _id: p._id,
      title: p.title,
      category: p.category,
      description: p.description,
      image: getImageUrl(p.image),
      tags: p.tags || [],
      liveUrl: p.liveUrl || undefined,
      githubUrl: p.githubUrl || undefined,
      caseStudyUrl: p.caseStudyUrl || undefined
    }));
    res.json(withImageUrls);
  } catch (err) {
    console.error('GET /api/projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - add a project (multipart: image file + fields). For local/admin use.
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const title = (req.body.title || '').trim();
    const category = (req.body.category || '').trim();
    const description = (req.body.description || '').trim();
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required' });
    }
    const tags = (req.body.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const liveUrl = (req.body.liveUrl || '').trim() || undefined;
    const githubUrl = (req.body.githubUrl || '').trim() || undefined;
    const caseStudyUrl = (req.body.caseStudyUrl || '').trim() || undefined;

    const ext = file.originalname.split('.').pop() || 'jpg';
    const safeName = `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}.${ext}`;
    const { url } = await uploadToImageKit(file.buffer, safeName, 'projects');

    const count = await Project.countDocuments();
    const project = await Project.create({
      title,
      category,
      description,
      image: url,
      tags,
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      caseStudyUrl: caseStudyUrl || '',
      order: count
    });
    res.status(201).json({
      _id: project._id,
      title: project.title,
      category: project.category,
      description: project.description,
      image: url,
      tags: project.tags,
      liveUrl: project.liveUrl || undefined,
      githubUrl: project.githubUrl || undefined,
      caseStudyUrl: project.caseStudyUrl || undefined
    });
  } catch (err) {
    console.error('POST /api/projects error:', err);
    if (err.message && err.message.includes('IMAGEKIT')) {
      return res.status(503).json({ error: 'Image upload not configured. Set ImageKit env vars.' });
    }
    res.status(500).json({ error: err.message || 'Failed to create project' });
  }
});

export default router;
