import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ViewSubmissions() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: ''
  });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError('');

        // For now, using mock data
        // In real implementation: const response = await assignmentsAPI.getSubmissions(courseId);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock submissions data
        setSubmissions([
          {
            _id: '1',
            student: { name: 'Alice Johnson', email: 'alice@example.com' },
            assignment: { title: 'Introduction to React', description: 'Build a simple React component' },
            submissionText: 'I have completed the React assignment. Here is my implementation of a todo list component with state management.',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'submitted',
            grade: null
          },
          {
            _id: '2',
            student: { name: 'Bob Smith', email: 'bob@example.com' },
            assignment: { title: 'JavaScript Fundamentals', description: 'Complete the JavaScript exercises' },
            submissionText: 'Here is my JavaScript assignment submission. I implemented all the required functions and tested them.',
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'submitted',
            grade: null
          }
        ]);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Failed to load submissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && currentUser) {
      fetchSubmissions();
    }
  }, [courseId, currentUser]);

  const handleGradeSubmit = async (submissionId) => {
    if (!currentUser) return;

    try {
      const gradeData = {
        submissionId,
        score: parseFloat(gradeForm.score),
        feedback: gradeForm.feedback,
        gradedBy: currentUser._id,
        gradedAt: new Date().toISOString()
      };

      // For now, simulate API call
      // In real implementation: await gradesAPI.submitGrade(submissionId, gradeData);

      console.log('Submitting grade:', gradeData);

      // Update local state
      setSubmissions(prev => prev.map(sub =>
        sub._id === submissionId
          ? { ...sub, grade: gradeData, status: 'graded' }
          : sub
      ));

      // Reset form
      setGradeForm({ score: '', feedback: '' });
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error submitting grade:', error);
      setError('Failed to submit grade. Please try again.');
    }
  };

  const openGradingModal = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      score: submission.grade?.score || '',
      feedback: submission.grade?.feedback || ''
    });
  };

  const closeGradingModal = () => {
    setSelectedSubmission(null);
    setGradeForm({ score: '', feedback: '' });
  };

  return (
    <ProtectedRoute role="teacher">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Grade Submissions</h1>
                <p className="mt-1 text-gray-600">
                  Review and grade student submissions for this course.
                </p>
              </div>
              <Link
                to={`/courses/${courseId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                ← Back to Course
              </Link>
            </div>
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
          ) : submissions.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.assignment.title}</div>
                        <div className="text-sm text-gray-500">{submission.assignment.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          submission.status === 'graded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status === 'graded' ? 'Graded' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {submission.grade ? `${submission.grade.score}/100` : 'Not graded'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openGradingModal(submission)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {submission.grade ? 'Update Grade' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Students will appear here once they submit their assignments for this course.
              </p>
            </div>
          )}

          {/* Grading Modal */}
          {selectedSubmission && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Grade Submission - {selectedSubmission.student.name}
                    </h3>
                    <button
                      onClick={closeGradingModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Assignment Details */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Assignment: {selectedSubmission.assignment.title}</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                      <p className="text-gray-700">{selectedSubmission.submissionText}</p>
                    </div>
                  </div>

                  {/* Grading Form */}
                  <form onSubmit={(e) => { e.preventDefault(); handleGradeSubmit(selectedSubmission._id); }} className="space-y-4">
                    <div>
                      <label htmlFor="score" className="block text-sm font-medium text-gray-700">
                        Score (out of 100) *
                      </label>
                      <input
                        type="number"
                        id="score"
                        value={gradeForm.score}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, score: e.target.value }))}
                        min="0"
                        max="100"
                        step="0.1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                        Feedback/Comments
                      </label>
                      <textarea
                        id="feedback"
                        value={gradeForm.feedback}
                        onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Provide detailed feedback to the student..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={closeGradingModal}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Submit Grade
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
