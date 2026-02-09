import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    orientation: { type: String, enum: ['portrait', 'landscape'], default: 'portrait' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Certificate = mongoose.model('Certificate', certificateSchema);
