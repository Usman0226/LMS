import express from 'express';
import { createAssignment, getCourseAssignments } from '../controllers/assignmentController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create assign for Teacher 
router.post('/create', authenticate, createAssignment);

// Get assignments for a specific course
router.get('/:courseId', getCourseAssignments);

export default router;

