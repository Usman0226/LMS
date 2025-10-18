import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AssignmentSubmissionForm({ assignment, onSubmissionComplete, onClose }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    submissionText: '',
    attachment: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        attachment: file
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to submit assignments');
      return;
    }

    if (!formData.submissionText.trim() && !formData.attachment) {
      setError('Please provide either a text submission or attach a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submissionData = {
        assignmentId: assignment._id,
        submissionText: formData.submissionText.trim(),
        submittedAt: new Date().toISOString()
      };

      // For now, we'll simulate API call success
      // In real implementation: await assignmentsAPI.submitAssignment(assignment._id, submissionData);

      console.log('Submitting assignment:', submissionData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call completion callback
      if (onSubmissionComplete) {
        onSubmissionComplete({
          _id: Date.now().toString(),
          ...submissionData,
          student: currentUser,
          status: 'submitted'
        });
      }

      // Reset form
      setFormData({
        submissionText: '',
        attachment: null
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setError('Failed to submit assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You must be logged in to submit assignments.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submit Assignment</h2>
          <p className="text-gray-600 mt-1">{assignment.title}</p>
        </div>
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

      {/* Assignment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Assignment Details</h3>
        <p className="text-gray-700 mb-2">{assignment.description}</p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
          <span>Points: {assignment.points}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="submissionText" className="block text-sm font-medium text-gray-700">
            Your Submission
          </label>
          <textarea
            id="submissionText"
            name="submissionText"
            rows={8}
            value={formData.submissionText}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Write your assignment submission here..."
          />
        </div>

        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
            Attach File (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="attachment" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload a file</span>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, TXT, JPG, PNG up to 10MB</p>
            </div>
          </div>
          {formData.attachment && (
            <div className="mt-2 flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-sm text-green-700 truncate">
                {formData.attachment.name}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, attachment: null }))}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
