import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model("Course", courseSchema);
