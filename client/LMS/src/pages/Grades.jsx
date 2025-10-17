import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gradesAPI } from '../services/api';

// Mock data for grades
const mockGrades = [
  {
    id: 1,
    courseId: 1,
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    instructor: 'Dr. Sarah Johnson',
    assignments: [
      { id: 1, title: 'Python Basics', pointsEarned: 95, pointsPossible: 100, weight: 20, submitted: true },
      { id: 2, title: 'Functions and Loops', pointsEarned: 88, pointsPossible: 100, weight: 20, submitted: true },
      { id: 3, title: 'Object-Oriented Programming', pointsEarned: 92, pointsPossible: 100, weight: 30, submitted: true },
      { id: 4, title: 'Final Project', pointsEarned: 0, pointsPossible: 100, weight: 30, submitted: false },
    ],
  },
  {
    id: 2,
    courseId: 2,
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    instructor: 'Prof. Michael Chen',
    assignments: [
      { id: 5, title: 'Vectors and Matrices', pointsEarned: 100, pointsPossible: 100, weight: 25, submitted: true },
      { id: 6, title: 'Linear Transformations', pointsEarned: 95, pointsPossible: 100, weight: 25, submitted: true },
      { id: 7, title: 'Eigenvalues and Eigenvectors', pointsEarned: 0, pointsPossible: 100, weight: 25, submitted: false },
      { id: 8, title: 'Final Exam', pointsEarned: 0, pointsPossible: 100, weight: 25, submitted: false },
    ],
  },
  {
    id: 3,
    courseId: 3,
    courseCode: 'ENG150',
    courseName: 'Academic Writing',
    instructor: 'Dr. Emily Wilson',
    assignments: [
      { id: 9, title: 'Research Paper Outline', pointsEarned: 45, pointsPossible: 50, weight: 20, submitted: true },
      { id: 10, title: 'First Draft', pointsEarned: 85, pointsPossible: 100, weight: 30, submitted: true },
      { id: 11, title: 'Peer Review', pointsEarned: 50, pointsPossible: 50, weight: 10, submitted: true },
      { id: 12, title: 'Final Paper', pointsEarned: 0, pointsPossible: 100, weight: 40, submitted: false },
    ],
  },
];

// Calculate course grade based on assignments
const calculateCourseGrade = (course) => {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let completedWeight = 0;
  
  course.assignments.forEach(assignment => {
    if (assignment.submitted) {
      const score = (assignment.pointsEarned / assignment.pointsPossible) * assignment.weight;
      totalWeightedScore += score;
      completedWeight += assignment.weight;
    }
    totalWeight += assignment.weight;
  });
  
  const currentGrade = completedWeight > 0 ? (totalWeightedScore / completedWeight) * 100 : 0;
  const maxPossibleGrade = currentGrade + (100 - completedWeight);
  
  return {
    currentGrade: Math.round(currentGrade * 10) / 10,
    maxPossibleGrade: Math.round(maxPossibleGrade * 10) / 10,
    letterGrade: getLetterGrade(currentGrade),
    completedWeight,
    totalWeight,
  };
};

// Convert percentage to letter grade
const getLetterGrade = (percentage) => {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

// Grade progress bar component
const GradeProgressBar = ({ percentage, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    red: 'bg-red-600',
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${colorClasses[color]} h-2.5 rounded-full`} 
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      ></div>
    </div>
  );
};

export default function Grades() {
  const { currentUser } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const isTeacher = currentUser?.role === 'teacher';

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch this from the API
        // const response = isTeacher 
        //   ? await gradesAPI.getGradesToGrade() 
        //   : await gradesAPI.getStudentGrades();
        
        // For now, we'll use mock data
        setTimeout(() => {
          // Calculate grades for each course
          const gradesWithCalculations = mockGrades.map(course => ({
            ...course,
            ...calculateCourseGrade(course),
          }));
          
          setGrades(gradesWithCalculations);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setLoading(false);
      }
    };

    fetchGrades();
  }, [isTeacher]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Filter grades by selected course
  const filteredGrades = selectedCourse === 'all' 
    ? grades 
    : grades.filter(grade => grade.courseId.toString() === selectedCourse);

  // Calculate overall grade
  const overallGrade = grades.length > 0
    ? grades.reduce((sum, grade) => sum + grade.currentGrade, 0) / grades.length
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isTeacher ? 'Gradebook' : 'My Grades'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isTeacher 
              ? 'View and manage student grades' 
              : 'Track your academic progress and performance'}
          </p>
        </div>
        
        {isTeacher && (
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Export Gradebook
            </button>
          </div>
        )}
      </div>

      {/* Overall Grade Summary */}
      {!isTeacher && grades.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Current GPA</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {overallGrade.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getLetterGrade(overallGrade)} - {getGradeDescription(overallGrade)}
              </p>
              <div className="mt-3">
                <GradeProgressBar percentage={overallGrade} />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Courses In Progress</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {grades.filter(grade => grade.completedWeight < 100).length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {grades.length} total courses
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Assignments Submitted</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {grades.reduce((sum, course) => 
                  sum + course.assignments.filter(a => a.submitted).length, 0
                )}
                <span className="text-lg text-gray-500"> / </span>
                {grades.reduce((sum, course) => sum + course.assignments.length, 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {Math.round(
                  (grades.reduce((sum, course) => 
                    sum + course.assignments.filter(a => a.submitted).length, 0) / 
                  Math.max(1, grades.reduce((sum, course) => 
                    sum + course.assignments.length, 0))) * 100
                )}% completion rate
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64 mb-4 sm:mb-0">
            <label htmlFor="course-filter" className="sr-only">
              Filter by course
            </label>
            <select
              id="course-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {grades.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              {filteredGrades.length} {filteredGrades.length === 1 ? 'course' : 'courses'}
            </span>
            <button
              type="button"
              className="ml-2 p-2 text-gray-400 hover:text-gray-500"
              title="Refresh"
              onClick={() => window.location.reload()}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grades List */}
      <div className="space-y-6">
        {filteredGrades.length > 0 ? (
          filteredGrades.map((course) => (
            <div key={course.id} className="bg-white shadow overflow-hidden rounded-lg">
              <div 
                className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCourseExpand(course.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {course.courseCode} - {course.courseName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Instructor: {course.instructor}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <span className="text-2xl font-semibold text-gray-900">
                        {course.currentGrade}%
                      </span>
                      <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {course.letterGrade}
                      </span>
                      <div className="text-xs text-gray-500">
                        {course.completedWeight}% of grade calculated
                      </div>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>Course Progress</span>
                    <span>{course.completedWeight}%</span>
                  </div>
                  <GradeProgressBar 
                    percentage={course.completedWeight} 
                    color={course.completedWeight < 50 ? 'red' : course.completedWeight < 80 ? 'yellow' : 'green'}
                  />
                </div>
              </div>
              
              {expandedCourse === course.id && (
                <div className="px-6 py-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignment
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {course.assignments.map((assignment) => (
                          <tr key={assignment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                !assignment.submitted 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : assignment.pointsEarned === 0 
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-green-100 text-green-800'
                              }`}>
                                {!assignment.submitted 
                                  ? 'Not Submitted' 
                                  : assignment.pointsEarned === 0 
                                    ? 'Submitted (Ungraded)'
                                    : 'Graded'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {assignment.submitted ? (
                                <>
                                  <span className={`font-medium ${
                                    (assignment.pointsEarned / assignment.pointsPossible) >= 0.9 
                                      ? 'text-green-600' 
                                      : (assignment.pointsEarned / assignment.pointsPossible) >= 0.7 
                                        ? 'text-yellow-600' 
                                        : 'text-red-600'
                                  }`}>
                                    {assignment.pointsEarned} / {assignment.pointsPossible}
                                  </span>
                                  <span className="ml-1">
                                    ({(assignment.pointsEarned / assignment.pointsPossible * 100).toFixed(1)}%)
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                              {assignment.weight}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {isTeacher && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Download Grade Report
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No grades found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isTeacher 
                ? 'No student grades are available for the selected filter.'
                : 'You have no graded assignments yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get grade description
function getGradeDescription(percentage) {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Very Good';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Satisfactory';
  return 'Needs Improvement';
}
