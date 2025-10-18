import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileURL: String,
  submissionText: String,
  submittedAt: { type: Date, default: Date.now },
  plagiarismStatus: {
    type: String,
    enum: ['clear', 'warning', 'flagged', 'pending'],
    default: 'pending'
  },
  similarityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  plagiarismReport: {
    matches: [
      {
        source: String,
        similarity: Number
      }
    ],
    checkedAt: Date,
    notes: String
  }
});

export default mongoose.model("Submission", submissionSchema);
