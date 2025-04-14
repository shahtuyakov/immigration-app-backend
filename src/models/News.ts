import mongoose, { Schema, Document } from 'mongoose';

interface News extends Document {
  headline: string;
  contentSummary: string;
  source: string;
  sourceUrl: string;
  publishedAt: Date;
  tags: string[];
  timezone: string;
}

const newsSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  contentSummary: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  tags: [String],
  timezone: {
    type: String,
    default: 'America/Chicago'
  }
});

export const News = mongoose.model<News>('News', newsSchema);