// Course Content Types and Interfaces (JSDoc format for JavaScript)

/**
 * @typedef {Object} Lesson
 * @property {string} _id - Unique lesson identifier
 * @property {string} title - Lesson title
 * @property {string} description - Lesson description
 * @property {string} content - Lesson content (HTML or text)
 * @property {'text'|'video'|'audio'|'document'} type - Content type
 * @property {string} [mediaUrl] - URL for media content
 * @property {number} [duration] - Duration in minutes
 * @property {number} order - Display order
 * @property {boolean} [isPreview] - Whether lesson is a preview
 */

/**
 * @typedef {Object} Module
 * @property {string} _id - Unique module identifier
 * @property {string} title - Module title
 * @property {string} description - Module description
 * @property {Lesson[]} lessons - Array of lessons in module
 * @property {number} order - Display order
 * @property {number} [estimatedDuration] - Estimated duration in minutes
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} _id - Unique question identifier
 * @property {string} question - Question text
 * @property {'multiple-choice'|'true-false'|'short-answer'} type - Question type
 * @property {string[]} [options] - Answer options for multiple choice
 * @property {string|string[]} correctAnswer - Correct answer(s)
 * @property {string} [explanation] - Explanation for correct answer
 * @property {number} points - Points for correct answer
 */

/**
 * @typedef {Object} Quiz
 * @property {string} _id - Unique quiz identifier
 * @property {string} title - Quiz title
 * @property {string} description - Quiz description
 * @property {QuizQuestion[]} questions - Array of quiz questions
 * @property {number} passingScore - Required percentage to pass
 * @property {number} [timeLimit] - Time limit in minutes
 * @property {number} attemptsAllowed - Maximum attempts allowed
 */

/**
 * @typedef {Object} Assignment
 * @property {string} _id - Unique assignment identifier
 * @property {string} title - Assignment title
 * @property {string} description - Assignment description
 * @property {string} instructions - Detailed instructions
 * @property {Date} [dueDate] - Assignment due date
 * @property {number} maxPoints - Maximum points possible
 * @property {'file'|'text'|'link'} submissionType - How to submit
 * @property {boolean} isGraded - Whether assignment is graded
 */

/**
 * @typedef {Object} CourseContent
 * @property {string} _id - Unique content identifier
 * @property {string} courseId - Associated course ID
 * @property {Module[]} modules - Course modules
 * @property {Quiz[]} quizzes - Course quizzes
 * @property {Assignment[]} assignments - Course assignments
 * @property {number} totalLessons - Total lesson count
 * @property {number} totalDuration - Total duration in minutes
 * @property {Date} lastUpdated - Last update timestamp
 */

/**
 * @typedef {Object} UserProgress
 * @property {string} userId - User identifier
 * @property {string} courseId - Course identifier
 * @property {string[]} completedLessons - Array of completed lesson IDs
 * @property {string[]} completedModules - Array of completed module IDs
 * @property {Object.<string, number>} quizScores - Quiz scores by quiz ID
 * @property {Object.<string, number>} assignmentScores - Assignment scores by assignment ID
 * @property {number} overallProgress - Overall completion percentage
 * @property {Date} lastAccessed - Last access timestamp
 * @property {Date} enrolledDate - Enrollment date
 * @property {Date} [completedDate] - Completion date if finished
 */
