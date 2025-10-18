import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CreateCourse() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    level: 'Beginner'
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
      setError('You must be logged in to create courses');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, we'll simulate API call success
      // In real implementation: await coursesAPI.createCourse(formData);

      console.log('Creating course:', formData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to courses page on success
      navigate('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute role="teacher">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Fill out the form below to create a new course for students to enroll in.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter course title"
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
                    placeholder="Describe what students will learn in this course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration *
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., 8 weeks, 3 months"
                    />
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                      Difficulty Level *
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Computer Science, Mathematics, English"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/courses')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
