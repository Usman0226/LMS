import express from 'express';
import { submitAssignment, getCourseSubmissions, getMySubmissions, recheckPlagiarism } from '../controllers/submissionController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Submit an assignment (Student only)
router.post('/submit-assign', authenticate, submitAssignment);

// Get submissions for a course (Teacher only)
router.get('/course/:courseId', authenticate, getCourseSubmissions);

// Get my submissions (Student)
router.get('/my-submission', authenticate, getMySubmissions);

// Re-run plagiarism analysis (Teacher or submission owner)
router.post('/:submissionId/recheck-plagiarism', authenticate, recheckPlagiarism);

export default router;