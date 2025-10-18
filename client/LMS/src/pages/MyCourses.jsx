import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

export default function MyCourses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch enrolled courses for the current student
        const response = await coursesAPI.getEnrolledCourses();
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setError('Failed to load your courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMyCourses();
    }
  }, [currentUser]);

  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-2 text-gray-600">
              View and manage the courses you're currently enrolled in.
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
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Duration: {course.duration}</span>
                          <span>•</span>
                          <span>Level: {course.level}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enrolled
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/courses/${course._id}`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No courses enrolled</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't enrolled in any courses yet. Browse available courses to get started.
              </p>
              <div className="mt-6">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
