import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  marks: Number,
  feedback: String,
  gradedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Grade", gradeSchema);
