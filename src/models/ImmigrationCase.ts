import mongoose, { Document, Schema } from 'mongoose';
// need to adjust this to match the interface from USCIS 

export interface IImmigrationCase extends Document {
  userId: mongoose.Types.ObjectId;
  caseNumber: string;
  caseType: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  documents: Array<{
    name: string;
    url: string;
    uploadedAt: Date;
  }>;
  nextDeadline?: Date;
  assignedLawyer?: mongoose.Types.ObjectId;
  notes: Array<{
    content: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const immigrationCaseSchema = new Schema<IImmigrationCase>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  caseNumber: {
    type: String,
    required: [true, 'Case number is required'],
    unique: true,
    trim: true
  },
  caseType: {
    type: String,
    required: [true, 'Case type is required'],
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'review', 'approved', 'rejected', 'appealing'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  description: {
    type: String,
    required: [true, 'Case description is required']
  },
  documents: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  nextDeadline: {
    type: Date
  },
  assignedLawyer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
immigrationCaseSchema.index({ userId: 1, status: 1 });
immigrationCaseSchema.index({ caseNumber: 1 }, { unique: true });

export const ImmigrationCase = mongoose.model<IImmigrationCase>('ImmigrationCase', immigrationCaseSchema);