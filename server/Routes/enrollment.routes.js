import express from 'express';
import { enrollCourse, getMyEnrollments, getEnrolledStudents } from '../controllers/enrollmentController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enroll in a course (Student only)
router.post('/enroll', authenticate, enrollCourse);

// Get my enrollments (Student)
router.get('/my-courses', authenticate, getMyEnrollments);

// Get enrolled students in a course (Teacher only)
router.get('/:courseId/students', authenticate, getEnrolledStudents);

export default router;
