// const Assignment = require('../models/Assignment');
import Assignment from "../models/assignment.model.js"
// const Course = require('../models/Course');
import Course from "../models/course.model.js"

// CREATE ASSIGNMENT (Teacher)
export const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate } = req.body;
    const course = await Course.findById(courseId);
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your course" });

    const assignment = await Assignment.create({ course: courseId, title, description, dueDate });
    res.status(201).json({ success: true, message: "Assignment created successfully", data: assignment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ASSIGNMENTS FOR A COURSE
export const getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
