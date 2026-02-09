import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    // ImageKit: store full URL (https://ik.imagekit.io/...) or path (e.g. "projects/xyz.jpg")
    image: { type: String, required: true },
    tags: [{ type: String }],
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    caseStudyUrl: { type: String, default: '' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
