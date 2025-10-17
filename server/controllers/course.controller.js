// const Course = require('../models/Course');
// const Enrollment = require('../models/Enrollment');

import Course from "../models/course.model.js"
import Enrollment from "../models/enrollment.model.js"

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
    const courses = await Course.find().populate('teacher', 'name email');
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
