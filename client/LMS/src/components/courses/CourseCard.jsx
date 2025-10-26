import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users, BarChart2, ArrowRight, UserPlus, CheckCircle } from 'lucide-react';

const CourseCard = ({ course, onEnroll, isStudent, isEnrolled = false, isLoading = false }) => {
  console.log('Rendering CourseCard with course:', course);
  console.log('CourseCard props:', { isStudent, isEnrolled, isLoading, hasOnEnroll: !!onEnroll });

  if (!course) {
    console.warn('CourseCard received null or undefined course');
    return null;
  }

  const handleEnrollClick = (e) => {
    e.preventDefault();
    if (onEnroll && !isEnrolled && !isLoading) {
      onEnroll();
    }
  };

  const isEnrolledState = isEnrolled || course.enrollmentStatus === 'enrolled';
  const shouldShowEnrollButton = isStudent && !isEnrolledState;
  
  console.log('Course card state:', {
    courseId: course._id,
    isStudent,
    isEnrolled: isEnrolledState,
    isLoading,
    shouldShowEnrollButton
  });

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-3xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2">
      {/* Course Image */}
      <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 relative rounded-t-3xl overflow-hidden">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary-400 to-primary-600">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {course.category || 'Course'}
        </div>
        {isEnrolled && (
          <div className="absolute top-3 left-3 bg-success text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Enrolled
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center mr-4">
            <Users className="h-4 w-4 mr-1" />
            {course.students?.length || course.enrolledCount || 0} students
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration || '4 weeks'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 h-12">
          {course.description || 'No description available'}
        </p>

        <div className="mb-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300">
              {course.teacher?.name?.charAt(0) || 'I'}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              {course.teacher?.name || 'Instructor'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {shouldShowEnrollButton ? (
            <button
              onClick={handleEnrollClick}
              disabled={isLoading}
              className={`btn-primary flex items-center text-sm font-medium px-3 py-1 rounded-full transition-all duration-200 ${
                isLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-white mr-1"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 mr-1" />
                  Enroll
                </>
              )}
            </button>
          ) : isEnrolledState ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Enrolled
            </span>
          ) : null}

          <Link
            to={`/courses/${course._id}/learn`}
            className="btn-secondary flex items-center text-sm font-medium px-3 py-1 rounded-full transition-all duration-200 hover:shadow-md"
          >
            Start Learning <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
