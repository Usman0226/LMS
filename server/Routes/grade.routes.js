import express from 'express';
import { gradeSubmission, getStudentOverallGrade, getCourseOverallGrades, getStudentCourseGrades,getStudentAssignmentGrades } from '../controllers/gradeController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// Grade a submission (Teacher only)
router.post('/assign-grade', authenticate, gradeSubmission);

// Get student's overall grade (Student/Teacher/Admin)
router.get('/student/:studentId/overall', authenticate, getStudentOverallGrade);

// Get overall grades for all students in a course (T)
router.get('/course/:courseId/overall', authenticate, getCourseOverallGrades);

// Get student's grades for a specific course (S/T)
router.get('/course/:courseId/student/:studentId', authenticate, getStudentCourseGrades);

//Get student's specific assignment grades (S/T)
router.get('/assignment/:assignmentId/student/:studentId', authenticate, getStudentAssignmentGrades);

export default router;
