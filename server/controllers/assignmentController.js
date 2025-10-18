// const Assignment = require('../models/Assignment');
import Assignment from "../models/assignment.model.js"
// const Course = require('../models/Course');
import Course from "../models/course.model.js"
// const Enrollment = require('../models/Enrollment');
import Enrollment from "../models/enrollment.model.js"
// Email service
import { sendBulkEmails } from "../services/emailService.js"

// CREATE ASSIGNMENT (Teacher)
export const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate } = req.body;
    const course = await Course.findById(courseId);
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your course" });

    const assignment = await Assignment.create({ course: courseId, title, description, dueDate });

    // Send email notifications to all enrolled students
    try {
      const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');
      const students = enrollments.map(e => e.student);

      if (students.length > 0) {
        await sendBulkEmails(students, 'newAssignment', {
          title,
          description,
          dueDate,
          course: course
        });
        console.log(`Assignment notifications sent to ${students.length} students`);
      }
    } catch (emailError) {
      console.error('Failed to send assignment notifications:', emailError);
      // Don't fail the assignment creation if email fails
    }

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
