import mongoose, { Document, Schema } from 'mongoose';

export interface ImmigrationCase extends Document<mongoose.Types.ObjectId> {
  userId: mongoose.Types.ObjectId;
  caseNumber: string;
  formType: string;
  submittedDate: Date;
  modifiedDate: Date;
  currentStatusTextEn: string;
  currentStatusDescEn: string;
  currentStatusTextEs: string;
  currentStatusDescEs: string;
  historyStatus: any; // You might want to define a more specific type for this later
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
  formType: {
    type: String,
    required: true
  },
  submittedDate: {
    type: Date,
    required: true
  },
  modifiedDate: {
    type: Date,
    required: true
  },
  currentStatusTextEn: {
    type: String,
    required: true
  },
  currentStatusDescEn: {
    type: String,
    required: true
  },
  currentStatusTextEs: {
    type: String,
    required: true
  },
  currentStatusDescEs: {
    type: String,
    required: true
  },
  historyStatus: Schema.Types.Mixed, // Consider defining a more specific schema later
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

mongoose.deleteModel(/^ImmigrationCase/);
export const ImmigrationCase = mongoose.model<ImmigrationCase>('ImmigrationCase', immigrationCaseSchema);