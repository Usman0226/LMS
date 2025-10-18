import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GradingInterface({ onClose }) {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: ''
  });

  useEffect(() => {
    // Simulate fetching submissions for the assignment
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // For now, using mock data
        // In real implementation: const response = await gradesAPI.getSubmissionsForAssignment(assignmentId);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock submissions data
        setSubmissions([
          {
            _id: '1',
            student: { name: 'Alice Johnson', email: 'alice@example.com' },
            submissionText: 'This is my assignment submission. I worked really hard on this project and implemented all the required features.',
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'submitted',
            grade: null
          },
          {
            _id: '2',
            student: { name: 'Bob Smith', email: 'bob@example.com' },
            submissionText: 'Here is my completed assignment. I followed all the instructions and added some extra features.',
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'submitted',
            grade: null
          }
        ]);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

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

  if (!currentUser || currentUser.role !== 'teacher') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Only teachers can access the grading interface.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Grade Submissions</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Students will appear here once they submit their assignments.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
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

              {/* Submission Content */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Student Submission:</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-gray-700">{selectedSubmission.submissionText}</p>
                </div>
              </div>

              {/* Grading Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleGradeSubmit(selectedSubmission._id); }} className="space-y-4">
                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700">
                    Score (out of 100)
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
                    placeholder="Provide feedback to the student..."
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
  );
}
