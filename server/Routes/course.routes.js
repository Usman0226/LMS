import express from 'express';
import { createCourse, getAllCourses, getTeacherCourses } from '../controllers/course.controller.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.post('/create', createCourse);
router.post('/create', authenticate, createCourse);

router.get('/getCourses', getAllCourses);
router.get('/teacher/me', authenticate, getTeacherCourses);
export default router;
