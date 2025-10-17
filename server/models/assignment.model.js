import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  dueDate: Date
});

export default mongoose.model("Assignment", assignmentSchema);
