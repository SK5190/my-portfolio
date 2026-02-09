import mongoose from 'mongoose';

// Single-document model: stores the current resume URL (e.g. from ImageKit) so it persists across deploys.
const resumeSchema = new mongoose.Schema(
  { url: { type: String, required: true } },
  { timestamps: true }
);

export const Resume = mongoose.model('Resume', resumeSchema);
