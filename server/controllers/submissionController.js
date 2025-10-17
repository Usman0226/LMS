// const Submission = require('../models/Submission');
// const Assignment = require('../models/Assignment');
// const Enrollment = require('../models/Enrollment');

import Submission from "../models/submission.model.js"
import Assignment from "../models/assignment.model.js"
import Enrollment from "../models/enrollment.model.js"

// SUBMIT ASSIGNMENT (Student)
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileURL } = req.body;
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: "Students only" });

    const assignment = await Assignment.findById(assignmentId);
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: assignment.course });
    if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in this course" });

    const submission = await Submission.create({ assignment: assignmentId, student: req.user._id, fileURL });
    res.status(201).json({ success: true, message: "Submission successful", data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SUBMISSIONS FOR COURSE (Teacher)
export const getCourseSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    const assignmentIds = assignments.map(a => a._id);

    const submissions = await Submission.find({ assignment: { $in: assignmentIds } })
      .populate('student', 'name email')
      .populate('assignment', 'title');
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get the submission made by the logged-in student
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user._id })
            .populate('assignment', 'title course');
        res.json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};