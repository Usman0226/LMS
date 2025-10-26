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
// GET ALL ASSIGNMENTS FOR USER'S COURSES
export const getUserAssignments = async (req, res) => {
  try {
    let courseIds = [];

    // If user is authenticated, get their courses
    if (req.user) {
      const query = req.user.role === 'teacher'
        ? { teacher: req.user._id }
        : { student: req.user._id };

      const enrollments = await Enrollment.find(query).populate('course');
      courseIds = enrollments.map(e => e.course._id);
    } else {
      // For unauthenticated requests (testing), get all courses
      const courses = await Course.find();
      courseIds = courses.map(c => c._id);
    }

    if (courseIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Find all assignments for these courses
    const assignments = await Assignment.find({
      course: { $in: courseIds },
      dueDate: { $gte: new Date() } // Only future assignments
    })
    .populate('course', 'title code')
    .sort({ dueDate: 1 }); // Sort by due date

    // If no assignments exist, create some sample assignments for testing
    if (assignments.length === 0 && courseIds.length > 0) {
      console.log('No assignments found, creating sample assignments...');

      const sampleAssignments = [
        {
          course: courseIds[0],
          title: 'Introduction to Programming',
          description: 'Write a simple program that demonstrates basic programming concepts.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          points: 100
        },
        {
          course: courseIds[0],
          title: 'Data Structures Overview',
          description: 'Research and explain different types of data structures and their use cases.',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          points: 150
        }
      ];

      await Assignment.insertMany(sampleAssignments);
      console.log('Created sample assignments');

      // Fetch assignments again after creating them
      const newAssignments = await Assignment.find({
        course: { $in: courseIds },
        dueDate: { $gte: new Date() }
      })
      .populate('course', 'title code')
      .sort({ dueDate: 1 });

      return res.json({ success: true, data: newAssignments });
    }

    res.json({ success: true, data: assignments });
  } catch (err) {
    console.error('Error getting user assignments:', err);
    res.status(500).json({ success: false, message: 'Error fetching assignments' });
  }
};

// GET ASSIGNMENTS FOR A SPECIFIC COURSE
// GET ASSIGNMENTS FOR A SPECIFIC COURSE WITH ENHANCED DETAILS
export const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Check if user is enrolled in the course (for students) or is the teacher
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId
      });
      
      if (!enrollment) {
        return res.status(403).json({ 
          success: false, 
          message: 'You are not enrolled in this course' 
        });
      }
    } else if (req.user.role === 'teacher') {
      const course = await Course.findById(courseId);
      if (!course || course.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'You are not authorized to view this course' 
        });
      }
    }

    // Build query
    const query = { course: courseId };
    
    // Add filter for past/upcoming assignments if specified
    if (req.query.filter === 'upcoming') {
      query.dueDate = { $gte: new Date() };
    } else if (req.query.filter === 'past') {
      query.dueDate = { $lt: new Date() };
    }

    // Execute query with pagination
    const assignments = await Assignment.find(query)
      .populate('course', 'title code')
      .populate({
        path: 'submissions',
        match: { student: req.user._id },
        select: 'status submittedAt grade feedback'
      })
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Assignment.countDocuments(query);

    res.json({
      success: true,
      data: assignments,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (err) {
    console.error('Error getting course assignments:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching course assignments' 
    });
  }
};
