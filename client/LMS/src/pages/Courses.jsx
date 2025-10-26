import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCourses } from '../context/CourseContext';
import { useNavigate } from 'react-router-dom';
// import CourseCard from '../components/courses/CourseCard';
// import EnhancedCourseCard from '../components/EnhancedCourseCard';
import CourseCard from '../components/CourseCard';
import { SkeletonGrid, SkeletonCourseCard, EmptyCourses } from '../components/ui';

const Courses = () => {
  const { currentUser, isStudent } = useAuth();
  const { 
    courses, 
    loading, 
    error,
    fetchCourses,
    enrollInCourse
  } = useCourses();
  const navigate = useNavigate();

  // Track enrollment state for each course
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  // Initialize enrolled courses based on user's enrolled courses or course students
  useEffect(() => {
    if (courses.length > 0 && currentUser) {
      const enrolled = new Set();
      courses.forEach(course => {
        // Check if user is in the students array or if course is marked as enrolled
        if (
          (course.students && course.students.includes(currentUser._id)) ||
          course.enrollmentStatus === 'enrolled' ||
          enrolledCourses.has(course._id)
        ) {
          enrolled.add(course._id);
        }
      });
      setEnrolledCourses(enrolled);
      console.log('Initialized enrolled courses:', Array.from(enrolled));
    }
  }, [courses, currentUser, isStudent]);

  // Debug current user and enrollment state
  useEffect(() => {
    console.log('Current user:', currentUser);
    console.log('User role:', currentUser?.role);
    console.log('Is student:', isStudent);
    console.log('Enrolled courses:', enrolledCourses);
    console.log('Enrolling courses:', enrollingCourses);
  }, [currentUser, enrolledCourses, enrollingCourses, isStudent]);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        console.log('Fetching courses...');
        await fetchCourses();
        console.log('Courses fetched successfully');
      } catch (error) {
        console.error('Error in Courses component:', error);
      }
    };

    // Only fetch if we don't have any courses yet
    if (courses.length === 0) {
      loadCourses();
    } else {
      // If we already have courses, make sure loading is set to false
      if (loading) {
        const timer = setTimeout(() => {
          if (isMounted) {
            // This will be handled by the context
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [fetchCourses, courses.length, loading]);

  const handleEnroll = async (courseId) => {
    // Prevent multiple clicks
    if (enrollingCourses.has(courseId) || enrolledCourses.has(courseId)) {
      console.log('Enrollment already in progress or user already enrolled');
      return;
    }

    console.log('Starting enrollment for course:', courseId);
    
    // Show loading state
    setEnrollingCourses(prev => new Set([...prev, courseId]));

    try {
      const result = await enrollInCourse(courseId);
      console.log('Enrollment result:', result);

      // Handle requires authentication
      if (result.requiresAuth) {
        console.log('Authentication required, redirecting to login');
        return;
      }

      if (result.success) {
        // Update enrolled courses state
        setEnrolledCourses(prev => {
          const newSet = new Set([...prev, courseId]);
          console.log('Updated enrolled courses:', Array.from(newSet));
          return newSet;
        });
        
        // Update the course in the courses list
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId 
              ? { 
                  ...course, 
                  enrollmentStatus: 'enrolled',
                  students: [...(course.students || []), currentUser?._id].filter(Boolean)
                } 
              : course
          )
        );
        
        console.log('Successfully enrolled in course:', courseId);
        // You can replace this with a toast notification
        alert('Successfully enrolled in the course!');
      } else {
        console.error('Enrollment failed:', result.error);
        alert(`Enrollment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      // Clear loading state
      setEnrollingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        console.log('Cleared loading state for course:', courseId);
        return newSet;
      });
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <SkeletonGrid items={6} ItemSkeleton={SkeletonCourseCard} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering Courses component', { 
    loading, 
    coursesCount: courses?.length, 
    courses,
    error 
  });

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl  font-bold text-gray-900 mb-2">Available Courses</h1>
        <p className="text-gray-600 dark:text-gray-500">Browse and enroll in our courses</p>
      </div>

      {loading && courses.length === 0 ? (
        <SkeletonGrid items={6} ItemSkeleton={SkeletonCourseCard} />
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <EmptyCourses
          isTeacher={!isStudent}
          onCreateCourse={() => navigate('/courses/create')}
          onBrowseCourses={() => navigate('/courses')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEnroll={() => handleEnroll(course._id)}
              isStudent={isStudent}
              isEnrolled={enrolledCourses.has(course._id)}
              isLoading={enrollingCourses.has(course._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
