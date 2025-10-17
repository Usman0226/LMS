import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileURL: String, // or text-based answers
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Submission", submissionSchema);
