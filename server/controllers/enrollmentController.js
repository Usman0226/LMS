// const Enrollment = require('../models/Enrollment');
// const Course = require('../models/Course');

import Enrollment from '../models/enrollment.model.js';
import Course from "../models/course.model.js"
// Email service
import sendEmail  from "../services/emailService.js"

// ENROLL IN COURSE (Student)
export const enrollCourse = async (req, res) => {
  try {
    // For development/testing, allow unauthenticated enrollment
    const userId = req.user ? req.user._id : 'test-student-id';
    const userEmail = req.user ? req.user.email : 'test@student.com';
    const userRole = req.user ? req.user.role : 'student';

    if (userRole !== 'student') {
      return res.status(403).json({ success: false, message: "Students only" });
    }

    const { courseId } = req.body;

    // Check if already enrolled
    const exists = await Enrollment.findOne({ student: userId, course: courseId });
    if (exists) {
      return res.status(400).json({ success: false, message: "Already enrolled" });
    }

    const enroll = await Enrollment.create({ student: userId, course: courseId });

    // Send welcome email to student (if authenticated)
    if (req.user) {
      try {
        const course = await Course.findById(courseId).populate('teacher', 'name');
        await sendEmail(req.user.email, 'courseEnrollment', {
          course: course,
          student: req.user
        });
        console.log(`Enrollment notification sent to ${req.user.email}`);
      } catch (emailError) {
        console.error('Failed to send enrollment notification:', emailError);
        // Don't fail the enrollment if email fails
      }
    }

    res.status(201).json({ success: true, message: "Enrolled successfully", data: enroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET STUDENT'S ENROLLED COURSES
export const getMyEnrollments = async (req, res) => {
  try {
    if (req.user) {
      // Authenticated user - get their enrollments
      const enrollments = await Enrollment.find({ student: req.user._id })
        .populate('course', 'title description duration');
      res.json({ success: true, data: enrollments });
    } else {
      // Unauthenticated - return empty array for testing
      res.json({ success: true, data: [] });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL STUDENTS IN A COURSE (Teacher)
export const getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your course" });

    const students = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email');
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
