// const Course = require('../models/Course');
// const Enrollment = require('../models/Enrollment');

import Course from "../models/course.model.js"
import Enrollment from "../models/enrollment.model.js"
import User from "../models/user.model.js"

// CREATE COURSE (Teacher)
export const createCourse = async (req, res) => {
  try {

    if (req.user.role !== 'teacher') return res.status(403).json({ success: false, message: "Access denied. Teachers only." });

    const { title, description, duration } = req.body;
    const course = await Course.create({ title, description, duration, teacher: req.user._id });

    res.status(201).json({ success: true, message: "Course created successfully", data: course });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    let courses = await Course.find().populate('teacher', 'name email');

    // If no courses exist, create some sample courses for testing
    if (courses.length === 0) {
      console.log('No courses found, creating sample courses...');

      // Create sample teacher user if none exists
      let teacher = await User.findOne({ role: 'teacher' });
      if (!teacher) {
        teacher = await User.create({
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@university.edu',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          role: 'teacher'
        });
        console.log('Created sample teacher user');
      }

      // Create sample courses
      const sampleCourses = [
        {
          title: 'Introduction to Computer Science',
          description: 'Learn the fundamentals of computer science including programming, algorithms, and data structures.',
          duration: '16 weeks',
          teacher: teacher._id
        },
        {
          title: 'Web Development Fundamentals',
          description: 'Master HTML, CSS, JavaScript, and modern web development frameworks.',
          duration: '12 weeks',
          teacher: teacher._id
        },
        {
          title: 'Database Design and Management',
          description: 'Learn database design principles, SQL, and modern database management systems.',
          duration: '10 weeks',
          teacher: teacher._id
        }
      ];

      await Course.insertMany(sampleCourses);
      console.log('Created sample courses');

      // Fetch courses again after creating them
      courses = await Course.find().populate('teacher', 'name email');
    }

    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id }).populate('teacher', 'name email');
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};