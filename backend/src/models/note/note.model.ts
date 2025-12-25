import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      index: true,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
noteSchema.index({ applicationId: 1, createdAt: -1 });
noteSchema.index({ authorId: 1 });

export const Note = mongoose.model('Note', noteSchema);
