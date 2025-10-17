// const Grade = require('../models/Grade');
// const Submission = require('../models/Submission');

import Grade from "../models/grade.model.js"
import Submission from "../models/submission.model.js"

// GRADE A SUBMISSION (Teacher)
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId, marks, feedback } = req.body;
    const submission = await Submission.findById(submissionId).populate({
      path: 'assignment',
      populate: { path: 'course' }
    });

    if (submission.assignment.course.teacher.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not your course" });

    const grade = await Grade.create({ submission: submissionId, student: submission.student, marks, feedback });
    res.status(201).json({ success: true, message: "Grade submitted successfully", data: grade });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET STUDENT'S OVERALL GRADE (Student/Teacher/Admin)
export const getStudentOverallGrade = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if user can view this student's grades
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: "Can only view your own grades" });
    }

    // Get all grades for the student
    const grades = await Grade.find({ student: studentId })
      .populate({
        path: 'submission',
        populate: {
          path: 'assignment',
          populate: { path: 'course', select: 'title' }
        }
      });

    if (grades.length === 0) {
      return res.json({
        success: true,
        data: {
          studentId,
          totalAssignments: 0,
          gradedAssignments: 0,
          overallPercentage: 0,
          overallGrade: 'N/A',
          courseBreakdown: []
        }
      });
    }

    // Calculate overall statistics
    const totalMarks = grades.reduce((sum, grade) => sum + (grade.marks || 0), 0);
    const totalPossibleMarks = grades.length * 100; // Assuming each assignment is out of 100
    const overallPercentage = (totalMarks / totalPossibleMarks) * 100;

    // Determine overall grade
    let overallGrade = 'F';
    if (overallPercentage >= 90) overallGrade = 'A';
    else if (overallPercentage >= 80) overallGrade = 'B';
    else if (overallPercentage >= 70) overallGrade = 'C';
    else if (overallPercentage >= 60) overallGrade = 'D';

    // Group grades by course
    const courseBreakdown = {};
    grades.forEach(grade => {
      const courseTitle = grade.submission?.assignment?.course?.title || 'Unknown Course';
      if (!courseBreakdown[courseTitle]) {
        courseBreakdown[courseTitle] = {
          courseTitle,
          assignments: [],
          totalMarks: 0,
          totalPossible: 0
        };
      }
      courseBreakdown[courseTitle].assignments.push({
        assignmentTitle: grade.submission?.assignment?.title || 'Unknown Assignment',
        marks: grade.marks,
        feedback: grade.feedback,
        gradedAt: grade.gradedAt
      });
      courseBreakdown[courseTitle].totalMarks += grade.marks || 0;
      courseBreakdown[courseTitle].totalPossible += 100;
    });

    // Calculate course-wise percentages
    Object.keys(courseBreakdown).forEach(courseTitle => {
      const course = courseBreakdown[courseTitle];
      course.percentage = (course.totalMarks / course.totalPossible) * 100;
      course.grade = course.percentage >= 90 ? 'A' :
                    course.percentage >= 80 ? 'B' :
                    course.percentage >= 70 ? 'C' :
                    course.percentage >= 60 ? 'D' : 'F';
    });

    const result = {
      studentId,
      totalAssignments: grades.length,
      gradedAssignments: grades.filter(g => g.marks !== null && g.marks !== undefined).length,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      overallGrade,
      courseBreakdown: Object.values(courseBreakdown)
    };

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET OVERALL GRADES FOR ALL STUDENTS IN A COURSE (Teacher only)
export const getCourseOverallGrades = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify the course belongs to the teacher
    const Course = (await import("../models/course.model.js")).default;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this course" });
    }

    // Get all students enrolled in the course
    const Enrollment = (await import("../models/enrollment.model.js")).default;
    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');

    if (enrollments.length === 0) {
      return res.json({
        success: true,
        data: {
          courseId,
          courseTitle: course.title,
          totalStudents: 0,
          students: []
        }
      });
    }

    // Get all assignments for the course
    const Assignment = (await import("../models/assignment.model.js")).default;
    const assignments = await Assignment.find({ course: courseId });

    if (assignments.length === 0) {
      return res.json({
        success: true,
        data: {
          courseId,
          courseTitle: course.title,
          totalStudents: enrollments.length,
          students: enrollments.map(e => ({
            studentId: e.student._id,
            studentName: e.student.name,
            studentEmail: e.student.email,
            assignmentsCompleted: 0,
            totalAssignments: 0,
            overallPercentage: 0,
            overallGrade: 'N/A'
          }))
        }
      });
    }

    const assignmentIds = assignments.map(a => a._id);

    // Get all submissions for these assignments (to find which students submitted)
    const submissions = await Submission.find({ assignment: { $in: assignmentIds } })
      .populate('student', 'name email')
      .populate('assignment', 'title');

    if (submissions.length === 0) {
      return res.json({
        success: true,
        data: {
          courseId,
          courseTitle: course.title,
          totalStudents: enrollments.length,
          totalAssignments: assignments.length,
          students: enrollments.map(e => ({
            studentId: e.student._id,
            studentName: e.student.name,
            studentEmail: e.student.email,
            assignmentsCompleted: 0,
            totalAssignments: assignments.length,
            overallPercentage: 0,
            overallGrade: 'N/A'
          }))
        }
      });
    }

    // Get all grades for these submissions
    const submissionIds = submissions.map(s => s._id);
    const grades = await Grade.find({ submission: { $in: submissionIds } })
      .populate('student', 'name email')
      .populate({
        path: 'submission',
        populate: { path: 'assignment', select: 'title' }
      });

    // Group grades by student
    const studentGrades = {};
    grades.forEach(grade => {
      const studentId = grade.student._id.toString();
      if (!studentGrades[studentId]) {
        studentGrades[studentId] = {
          studentId: grade.student._id,
          studentName: grade.student.name,
          studentEmail: grade.student.email,
          grades: []
        };
      }
      studentGrades[studentId].grades.push(grade);
    });

    // Calculate overall grades for each student
    const studentsWithGrades = enrollments.map(enrollment => {
      const studentId = enrollment.student._id.toString();
      const studentData = studentGrades[studentId] || { grades: [] };

      const totalMarks = studentData.grades.reduce((sum, grade) => sum + (grade.marks || 0), 0);
      const totalPossibleMarks = studentData.grades.length * 100;
      const overallPercentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;

      let overallGrade = 'F';
      if (overallPercentage >= 90) overallGrade = 'A';
      else if (overallPercentage >= 80) overallGrade = 'B';
      else if (overallPercentage >= 70) overallGrade = 'C';
      else if (overallPercentage >= 60) overallGrade = 'D';

      return {
        studentId: enrollment.student._id,
        studentName: enrollment.student.name,
        studentEmail: enrollment.student.email,
        assignmentsCompleted: studentData.grades.length,
        totalAssignments: assignments.length,
        overallPercentage: Math.round(overallPercentage * 100) / 100,
        overallGrade
      };
    });

    const result = {
      courseId,
      courseTitle: course.title,
      totalStudents: enrollments.length,
      totalAssignments: assignments.length,
      students: studentsWithGrades
    };

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET STUDENT'S GRADES FOR A SPECIFIC COURSE (Student/Teacher)
export const getStudentCourseGrades = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Check if user can view this student's grades
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: "Can only view your own grades" });
    }

    // Verify the course exists and user has access
    const Course = (await import("../models/course.model.js")).default;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (req.user.role === 'student') {
      // Check if student is enrolled in the course
      const Enrollment = (await import("../models/enrollment.model.js")).default;
      const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
      if (!enrollment) {
        return res.status(403).json({ success: false, message: "Not enrolled in this course" });
      }
    } else if (req.user.role === 'teacher') {
      // Check if this is the teacher's course
      if (course.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Not authorized to view this course" });
      }
    }

    // Get all assignments for the course
    const Assignment = (await import("../models/assignment.model.js")).default;
    const assignments = await Assignment.find({ course: courseId });

    if (assignments.length === 0) {
      return res.json({
        success: true,
        data: {
          courseId,
          courseTitle: course.title,
          studentId,
          assignments: []
        }
      });
    }

    const assignmentIds = assignments.map(a => a._id);

    // Get all submissions for this student in this course
    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignmentIds }
    }).populate('assignment', 'title');

    if (submissions.length === 0) {
      return res.json({
        success: true,
        data: {
          courseId,
          courseTitle: course.title,
          studentId,
          assignments: assignments.map(a => ({
            assignmentId: a._id,
            assignmentTitle: a.title,
            marks: null,
            feedback: null,
            gradedAt: null,
            status: 'not_submitted'
          }))
        }
      });
    }

    // Get all grades for these submissions
    const submissionIds = submissions.map(s => s._id);
    const grades = await Grade.find({ submission: { $in: submissionIds } })
      .populate({
        path: 'submission',
        populate: { path: 'assignment', select: 'title' }
      });

    // Structure the response
    const assignmentsWithGrades = assignments.map(assignment => {
      const grade = grades.find(g => g.submission?.assignment?._id.toString() === assignment._id.toString());

      return {
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        marks: grade?.marks || null,
        feedback: grade?.feedback || null,
        gradedAt: grade?.gradedAt || null,
        status: grade ? 'graded' : 'pending'
      };
    });

    const result = {
      courseId,
      courseTitle: course.title,
      studentId,
      assignments: assignmentsWithGrades
    };

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getStudentAssignmentGrades = async(req,res)=>{
    try{
        const {assignmentId,studentId} = req.params;

        console.log('Looking for assignment:', assignmentId, 'student:', studentId);

        // First, verify the assignment exists
        const Assignment = (await import("../models/assignment.model.js")).default;
        const assignment = await Assignment.findById(assignmentId);

        if(!assignment){
            console.log('Assignment not found');
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        console.log('Assignment found:', assignment.title);

        // Find the submission for this student and assignment
        const Submission = (await import("../models/submission.model.js")).default;
        const submission = await Submission.findOne({
            student: studentId,
            assignment: assignmentId
        });

        console.log('Submission query result:', submission);

        if(!submission){
            console.log('No submission found - student has not submitted');
            // Student hasn't submitted the assignment yet
            return res.json({
                success: true,
                data: {
                    assignmentId,
                    assignmentTitle: assignment.title,
                    studentId,
                    submissionStatus: "not_submitted",
                    gradeStatus: "not_submitted",
                    marks: null,
                    feedback: null,
                    gradedAt: null
                }
            });
        }

        console.log('Submission found:', submission._id);

        // Find the grade for that submission
        const Grade = (await import("../models/grade.model.js")).default;
        console.log('Looking for grade with submission:', submission._id, 'student:', studentId);

        // Debug: Check if any grades exist for this submission
        const allGradesForSubmission = await Grade.find({ submission: submission._id });
        console.log('All grades for this submission:', allGradesForSubmission);

        const grade = await Grade.findOne({
            submission: submission._id,
            student: studentId
        })
        .populate({
            path: 'submission',
            populate: { path: 'assignment', select: 'title' }
        });

        console.log('Grade query result:', grade);

        if(!grade){
            console.log('No grade found - submission exists but not graded');
            // Student submitted but not graded yet
            return res.json({
                success: true,
                data: {
                    assignmentId,
                    assignmentTitle: assignment.title,
                    studentId,
                    submissionStatus: "submitted",
                    gradeStatus: "pending",
                    marks: null,
                    feedback: null,
                    gradedAt: null,
                    submittedAt: submission.submittedAt
                }
            });
        }

        console.log('Grade found:', grade.marks, grade.feedback);

        // Return the graded assignment
        res.json({ success: true, data: grade });

    }catch(error){
        console.error('Error in getStudentAssignmentGrades:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}