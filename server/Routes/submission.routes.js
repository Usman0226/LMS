import express from 'express';
import { submitAssignment, getCourseSubmissions, getMySubmissions } from '../controllers/submissionController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Submit an assignment (Student only)
router.post('/submit-assign', authenticate, submitAssignment);

// Get submissions for a course (Teacher only)
router.get('/course/:courseId', authenticate, getCourseSubmissions);

// Get my submissions (Student)
router.get('/my-submission', authenticate, getMySubmissions);

export default router;