import express from 'express';
import { 
  createAssignment, 
  getCourseAssignments, 
  getUserAssignments 
} from '../controllers/assignmentController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create assignment (Teacher)
router.post('/create', authenticate, createAssignment);

// Get all assignments for current user's courses
router.get('/', authenticate, getUserAssignments);

// Get assignments for a specific course
router.get('/:courseId', getCourseAssignments);

export default router;

