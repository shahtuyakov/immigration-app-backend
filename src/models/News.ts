import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  source: string;
  url: string;
  category: string[];
  publishedAt: Date;
  thumbnailUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    unique: true
  },
  category: [{
    type: String,
    required: [true, 'At least one category is required']
  }],
  publishedAt: {
    type: Date,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ url: 1 }, { unique: true });

export const News = mongoose.model<INews>('News', newsSchema);