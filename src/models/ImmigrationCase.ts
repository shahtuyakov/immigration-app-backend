import mongoose, { Document, Schema } from 'mongoose';

export interface IImmigrationCase extends Document {
  userId: mongoose.Types.ObjectId;
  caseNumber: string;
  name: string;
  status: string;
  description: string;
  formNumber: string;
  formTitle: string;
  lastUpdated: Date;
}

const immigrationCaseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caseNumber: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  status: String,
  description: String,
  formNumber: String,
  formTitle: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

mongoose.deleteModel(/^ImmigrationCase/);
export const ImmigrationCase = mongoose.model<IImmigrationCase>('ImmigrationCase', immigrationCaseSchema);
