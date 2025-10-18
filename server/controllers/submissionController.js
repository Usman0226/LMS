// const Submission = require('../models/Submission');
// const Assignment = require('../models/Assignment');
// const Enrollment = require('../models/Enrollment');

import Submission from "../models/submission.model.js"
import Assignment from "../models/assignment.model.js"
import Enrollment from "../models/enrollment.model.js"

async function queueMockPlagiarismCheck(submissionId) {
  try {
    const submission = await Submission.findById(submissionId).populate('assignment');
    if (!submission) return;

    const textLength = submission.submissionText?.length || 0;
    const similarityScore = Math.min(100, Math.round((textLength % 250) * 0.4 + 10));

    let status = 'clear';
    if (similarityScore >= 70) status = 'flagged';
    else if (similarityScore >= 40) status = 'warning';

    submission.plagiarismStatus = status;
    submission.similarityScore = similarityScore;
    submission.plagiarismReport = {
      matches: [
        {
          source: 'Internal Repository Match',
          similarity: Math.round(similarityScore * 0.6)
        },
        {
          source: 'Open Web Source',
          similarity: Math.round(similarityScore * 0.3)
        }
      ],
      checkedAt: new Date(),
      notes: 'Mock plagiarism analysis complete.'
    };

    await submission.save();
  } catch (error) {
    console.error('Mock plagiarism check failed:', error);
  }
}

// SUBMIT ASSIGNMENT (Student)
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileURL, submissionText } = req.body;
    if (req.user.role !== 'student') return res.status(403).json({ success: false, message: "Students only" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: assignment.course });
    if (!enrollment) return res.status(403).json({ success: false, message: "Not enrolled in this course" });

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      fileURL,
      submissionText,
      plagiarismStatus: 'pending'
    });

    // Trigger mock plagiarism analysis (replace with real service integration)
    queueMockPlagiarismCheck(submission._id);

    res.status(201).json({ success: true, message: "Submission successful", data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SUBMISSIONS FOR COURSE (Teacher)
export const getCourseSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    const assignmentIds = assignments.map(a => a._id);

    const submissions = await Submission.find({ assignment: { $in: assignmentIds } })
      .populate('student', 'name email')
      .populate('assignment', 'title');
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get the submission made by the logged-in student
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.user._id })
            .populate('assignment', 'title course');
        res.json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const recheckPlagiarism = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId).populate({
      path: 'assignment',
      populate: { path: 'course', select: 'teacher' }
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const isOwner = submission.student.toString() === req.user._id.toString();
    const courseTeacherId = submission.assignment?.course?.teacher?.toString();
    const isTeacher = req.user.role === 'teacher' && courseTeacherId && courseTeacherId === req.user._id.toString();

    if (!isOwner && !isTeacher) {
      return res.status(403).json({ success: false, message: "Not authorized to recheck this submission" });
    }

    submission.plagiarismStatus = 'pending';
    submission.similarityScore = 0;
    submission.plagiarismReport = null;
    await submission.save();

    queueMockPlagiarismCheck(submission._id);

    res.json({ success: true, message: "Plagiarism check queued", data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};