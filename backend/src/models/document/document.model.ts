import mongoose from 'mongoose';

export const DOCUMENT_TYPES = ['resume', 'cover_letter', 'supporting_document', 'other'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      default: 'other',
    },
    applicationId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

documentSchema.index({ userId: 1, documentType: 1 });
documentSchema.index({ applicationId: 1 });

export const Document = mongoose.model('Document', documentSchema);
