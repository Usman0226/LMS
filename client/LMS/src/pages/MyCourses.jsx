import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { BookOpen, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function MyCourses() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    courses: userCourses,
    loading: coursesLoading,
    error,
    fetchMyCourses
  } = useCourses();

  const isTeacher = currentUser?.role === 'teacher';

  useEffect(() => {
    if (currentUser) {
      fetchMyCourses();
    }
  }, [currentUser, fetchMyCourses]);

  const getPageTitle = () => {
    if (isTeacher) {
      return `My Created Courses (${userCourses.length})`;
    }
    return `My Enrolled Courses (${userCourses.length})`;
  };

  const getPageDescription = () => {
    if (isTeacher) {
      return 'Courses you have created and are teaching';
    }
    return 'Courses you are currently enrolled in';
  };

  const getEmptyMessage = () => {
    if (isTeacher) {
      return {
        title: 'No courses created yet',
        description: 'Start creating courses to share your knowledge with students.',
        buttonText: 'Create Your First Course',
        buttonAction: () => navigate('/courses/create')
      };
    }
    return {
      title: 'No courses enrolled yet',
      description: 'Browse available courses and enroll in ones that interest you.',
      buttonText: 'Browse All Courses',
      buttonAction: () => navigate('/courses')
    };
  };

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="mt-2 text-gray-600">
                {getPageDescription()}
              </p>
            </div>
            <button
              onClick={() => navigate(isTeacher ? '/courses/create' : '/courses')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {isTeacher ? 'Create Course' : 'Browse All Courses'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {coursesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : userCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{getEmptyMessage().title}</h3>
            <p className="mt-2 text-gray-500">{getEmptyMessage().description}</p>
            <div className="mt-6">
              <button
                onClick={getEmptyMessage().buttonAction}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                {getEmptyMessage().buttonText}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-r from-primary-100 to-primary-50 flex items-center justify-center">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="h-12 w-12 text-primary-600" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isTeacher
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isTeacher ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Teaching
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enrolled
                        </>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">
                      {isTeacher
                        ? `${course.students?.length || 0} students`
                        : `${course.students?.length || 0} enrolled`
                      }
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {course.duration || 'Self-paced'}
                    </span>
                    <Link
                      to={`/courses/${course._id}/learn`}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                    >
                      {isTeacher ? 'Manage Course' : 'Continue Learning'} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
