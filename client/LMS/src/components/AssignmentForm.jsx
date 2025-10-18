import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentsAPI } from '../services/api';

export default function AssignmentForm({ courseId, onAssignmentCreated, onClose }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: '',
    instructions: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create assignments');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const assignmentData = {
        ...formData,
        courseId,
        points: parseInt(formData.points),
        dueDate: new Date(formData.dueDate).toISOString()
      };

      console.log('Creating assignment:', assignmentData);

      // Call API to create assignment
      const response = await assignmentsAPI.createAssignment(assignmentData);
      
      // Get the created assignment from response
      const createdAssignment = response.data.data;

      // Call the callback with created assignment
      if (onAssignmentCreated) {
        onAssignmentCreated(createdAssignment);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        points: '',
        instructions: ''
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating assignment:', error);
      setError(error.response?.data?.message || 'Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">You must be logged in to create assignments.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Assignment Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter assignment title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe the assignment requirements and objectives"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date *
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700">
              Points/Marks *
            </label>
            <input
              type="number"
              id="points"
              name="points"
              value={formData.points}
              onChange={handleInputChange}
              required
              min="1"
              max="1000"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            Detailed Instructions
          </label>
          <textarea
            id="instructions"
            name="instructions"
            rows={6}
            value={formData.instructions}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Provide detailed instructions, requirements, and any additional information students need to complete this assignment"
          />
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
            {loading ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}
