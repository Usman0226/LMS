import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function MyGrades() {
  const { currentUser } = useAuth();
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        setError('');

        // For now, using mock data
        // In real implementation: const response = await gradesAPI.getMyGrades(currentUser._id);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock grade data
        setGradeData({
          overallGrade: 87.5,
          totalAssignments: 8,
          completedAssignments: 6,
          averageScore: 87.5,
          courseBreakdown: [
            {
              courseId: '1',
              courseName: 'Introduction to Computer Science',
              assignments: [
                { assignmentId: '1', title: 'Python Basics', score: 90, maxScore: 100, submittedAt: '2024-01-15' },
                { assignmentId: '2', title: 'Data Structures', score: 85, maxScore: 100, submittedAt: '2024-01-22' },
                { assignmentId: '3', title: 'Algorithms', score: 88, maxScore: 100, submittedAt: '2024-01-29' }
              ]
            },
            {
              courseId: '2',
              courseName: 'Linear Algebra',
              assignments: [
                { assignmentId: '4', title: 'Matrix Operations', score: 92, maxScore: 100, submittedAt: '2024-01-20' },
                { assignmentId: '5', title: 'Vector Spaces', score: 78, maxScore: 100, submittedAt: '2024-02-05' },
                { assignmentId: '6', title: 'Eigenvalues', score: null, maxScore: 100, submittedAt: null }
              ]
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching grades:', error);
        setError('Failed to load grades. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchGrades();
    }
  }, [currentUser]);

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
            <p className="mt-1 text-gray-600">
              View your academic performance and assignment grades.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : gradeData ? (
            <div className="space-y-6">
              {/* Overall Grade Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getGradeColor(gradeData.overallGrade)}`}>
                      {getGradeLetter(gradeData.overallGrade)}
                    </div>
                    <div className="text-sm text-gray-500">Letter Grade</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getGradeColor(gradeData.overallGrade)}`}>
                      {gradeData.overallGrade}%
                    </div>
                    <div className="text-sm text-gray-500">Overall Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {gradeData.completedAssignments}/{gradeData.totalAssignments}
                    </div>
                    <div className="text-sm text-gray-500">Assignments Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {gradeData.averageScore}%
                    </div>
                    <div className="text-sm text-gray-500">Average Score</div>
                  </div>
                </div>
              </div>

              {/* Course Breakdown */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Course Breakdown</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {gradeData.courseBreakdown.map((course) => (
                    <div key={course.courseId} className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{course.courseName}</h3>

                      <div className="space-y-3">
                        {course.assignments.map((assignment) => (
                          <div key={assignment.assignmentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{assignment.title}</div>
                              <div className="text-sm text-gray-500">
                                Submitted: {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : 'Not submitted'}
                              </div>
                            </div>
                            <div className="text-right">
                              {assignment.score !== null ? (
                                <div className={`text-lg font-semibold ${getGradeColor((assignment.score / assignment.maxScore) * 100)}`}>
                                  {assignment.score}/{assignment.maxScore}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">Not graded</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No grades available</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any graded assignments yet. Complete and submit assignments to see your grades here.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
