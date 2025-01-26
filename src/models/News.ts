import mongoose, { Schema, Document } from 'mongoose';

interface INews extends Document {
  headline: string;
  content: string;
  contentSummary: string;
  imageUrl?: string;
  source: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  region: string;
  categories: string[];
  tags: string[];
  contentLength: number;
  timezone: string;
}

const newsSchema = new Schema({
  headline: {
    type: String,
    required: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true,
    maxLength: 5000
  },
  contentSummary: {
    type: String,
    required: true,
    maxLength: 500
  },
  imageUrl: String,
  source: {
    type: String,
    required: true
  },
  author: String,
  publishedAt: {
    type: Date,
    required: true
  },
  updatedAt: Date,
  region: {
    type: String,
    required: true
  },
  categories: [{
    type: String,
    enum: [
      'Immigration News'
    ]
  }],
  tags: [String],
  contentLength: Number,
  timezone: {
    type: String,
    default: 'America/Chicago'
  }
});

// Auto-calculate content length before save
newsSchema.pre('save', function(next) {
  this.contentLength = this.content.length;
  next();
});

export const News = mongoose.model<INews>('News', newsSchema);