/**
 * Seed initial projects into MongoDB.
 * Run: node scripts/seedProjects.js (from backend folder, with MONGODB_URI in .env)
 *
 * After seeding, replace the "image" field for each project with your ImageKit URL or path:
 * - Full URL: https://ik.imagekit.io/YOUR_ID/projects/your-image.jpg
 * - Or path only: projects/your-image.jpg (IMAGEKIT_URL_ENDPOINT must be set)
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Set MONGODB_URI in .env');
  process.exit(1);
}

const seedProjects = [
  {
    title: 'Delivery Management System',
    category: 'Full Stack Development',
    description: 'Enterprise-level delivery management platform with real-time tracking, order management, analytics dashboard, and automated notifications. Built with MERN stack featuring JWT authentication, RESTful APIs, and responsive design.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Socket.io'],
    liveUrl: '#',
    githubUrl: '#',
    caseStudyUrl: '#',
    order: 0
  },
  {
    title: 'Social Media Growth Campaign',
    category: 'Social Media Management',
    description: 'Managed comprehensive social media strategy resulting in 300% follower growth and 500% engagement increase. Created content calendar, designed visuals, and implemented data-driven optimization.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1080',
    tags: ['Instagram', 'Content Strategy', 'Analytics', 'Branding'],
    caseStudyUrl: '#',
    order: 1
  },
  {
    title: 'Brand Video Campaign',
    category: 'Video Editing',
    description: 'Created compelling brand story through professional video editing, motion graphics, and color grading. Delivered 10+ videos for social media and marketing campaigns with high engagement rates.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1080',
    tags: ['Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics'],
    caseStudyUrl: '#',
    order: 2
  },
  {
    title: 'E-Commerce Platform',
    category: 'Full Stack Development',
    description: 'Full-featured online store with shopping cart, payment gateway integration, admin dashboard, and inventory management. Optimized for performance and user experience.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1080',
    tags: ['MERN Stack', 'Stripe', 'Redux', 'Tailwind'],
    liveUrl: '#',
    githubUrl: '#',
    order: 3
  },
  {
    title: 'Digital Brand Launch',
    category: 'Entrepreneurship',
    description: 'Founded and launched digital brand from concept to market. Managed product development, marketing strategy, content creation, and customer acquisition.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080',
    tags: ['Business Strategy', 'Marketing', 'Product Development'],
    caseStudyUrl: '#',
    order: 4
  },
  {
    title: 'Creative Digital Portfolio',
    category: 'Digital Creation',
    description: 'Comprehensive digital presence including website design, social media assets, brand identity, and content strategy. Showcasing creative versatility.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1080',
    tags: ['Design', 'Branding', 'Content', 'Strategy'],
    caseStudyUrl: '#',
    order: 5
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  const existing = await Project.countDocuments();
  if (existing > 0) {
    console.log('Projects already exist. Clear collection first if you want to re-seed.');
    process.exit(0);
    return;
  }
  await Project.insertMany(seedProjects);
  console.log('Seeded', seedProjects.length, 'projects. Update "image" in MongoDB with your ImageKit URLs.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
