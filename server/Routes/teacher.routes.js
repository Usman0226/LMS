import {Router} from "express"

import {createAssignment, getCourseAssignments} from "../controllers/assignmentController.js"
import {createCourse, getAllCourses} from "../controllers/course.controller.js"
import {gradeSubmission, getMyGrades} from "../controllers/gradeController.js"
import {submitAssignment, getCourseSubmissions, getMySubmissions} from "../controllers/submissionController.js" 


const router = Router();

// Course Routes
router.post("/create/courses", createCourse);
router.get("/get/courses", getAllCourses);

// Assignment Routes
router.post("/assignments", createAssignment);
router.get("/assignments/course/:courseId", getCourseAssignments);

//submission's and grades
