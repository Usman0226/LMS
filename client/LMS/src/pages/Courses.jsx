import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import { coursesAPI } from '../services/api';

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science and programming with Python.',
    instructor: 'Dr. Sarah Johnson',
    credits: 4,
    status: 'Enroll Now',
    students: 125,
    duration: '12 weeks',
    level: 'Beginner',
  },
  {
    id: 2,
    code: 'MATH201',
    title: 'Linear Algebra',
    description: 'Study vectors, matrices, and linear transformations with real-world applications.',
    instructor: 'Prof. Michael Chen',
    credits: 3,
    status: 'Enroll Now',
    students: 89,
    duration: '10 weeks',
    level: 'Intermediate',
  },
  {
    id: 3,
    code: 'ENG150',
    title: 'Academic Writing',
    description: 'Develop your academic writing skills for university-level coursework.',
    instructor: 'Dr. Emily Wilson',
    credits: 3,
    status: 'Enroll Now',
    students: 67,
    duration: '8 weeks',
    level: 'Beginner',
  },
  {
    id: 4,
    code: 'PHYS202',
    title: 'Classical Mechanics',
    description: 'Explore the fundamental principles of classical mechanics and their applications.',
    instructor: 'Dr. Robert Taylor',
    credits: 4,
    status: 'Enroll Now',
    students: 42,
    duration: '14 weeks',
    level: 'Advanced',
  },
  {
    id: 5,
    code: 'BIO101',
    title: 'Introduction to Biology',
    description: 'An overview of biological concepts including cell biology, genetics, and evolution.',
    instructor: 'Dr. Lisa Wong',
    credits: 3,
    status: 'Enroll Now',
    students: 113,
    duration: '12 weeks',
    level: 'Beginner',
  },
  {
    id: 6,
    code: 'CHEM201',
    title: 'Organic Chemistry',
    description: 'Study the structure, properties, and reactions of organic compounds.',
    instructor: 'Dr. James Wilson',
    credits: 4,
    status: 'Enroll Now',
    students: 78,
    duration: '16 weeks',
    level: 'Intermediate',
  },
];

// Mock enrolled courses for the current user
const mockEnrolledCourses = [1, 3]; // IDs of enrolled courses

export default function Courses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    sortBy: 'recent',
  });
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('Courses - Starting data fetch for user:', currentUser);

        // Use mock data for now to prevent crashes
        setTimeout(() => {
          // Mark enrolled courses
          const coursesWithEnrollment = mockCourses.map(course => ({
            ...course,
            isEnrolled: mockEnrolledCourses.includes(course.id),
          }));
          
          setCourses(coursesWithEnrollment);
          setLoading(false);
          console.log('Courses - Mock data loaded successfully');
        }, 500);

        // Uncomment below to re-enable API calls
        /*
        // Fetch all courses
        const response = await coursesAPI.getAllCourses();
        const allCourses = response.data.data || [];

        // If user is logged in, fetch their enrolled courses
        if (currentUser) {
          try {
            const enrolledResponse = await coursesAPI.getEnrolledCourses();
            const enrolledCourses = enrolledResponse.data.data || [];
            const enrolledIds = enrolledCourses.map(course => course._id);

            // Mark enrolled courses
            const coursesWithEnrollment = allCourses.map(course => ({
              ...course,
              isEnrolled: enrolledIds.includes(course._id),
            }));

            setCourses(coursesWithEnrollment);
          } catch (enrolledError) {
            console.log('Error fetching enrolled courses:', enrolledError);
            // Still show all courses even if enrollment check fails
            setCourses(allCourses.map(course => ({ ...course, isEnrolled: false })));
          }
        } else {
          // Not logged in, show all courses without enrollment status
          setCourses(allCourses.map(course => ({ ...course, isEnrolled: false })));
        }

        setLoading(false);
        */
      } catch (error) {
        console.error('Error in Courses fetchCourses:', error);
        // Fallback to mock data on any error
        setTimeout(() => {
          const coursesWithEnrollment = mockCourses.map(course => ({
            ...course,
            isEnrolled: mockEnrolledCourses.includes(course.id),
          }));
          setCourses(coursesWithEnrollment);
          setLoading(false);
        }, 500);
      }
    };

    fetchCourses();
  }, [currentUser]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEnrolledOnly = () => {
    setShowEnrolledOnly(!showEnrolledOnly);
  };

  const handleCreateCourse = () => {
    if (!currentUser) {
      alert('Please login to create courses');
      return;
    }

    if (!isTeacher) {
      alert('Only teachers can create courses');
      return;
    }

    // Redirect to course creation page or open modal
    // For now, we'll just show an alert
    alert('Course creation functionality will be implemented soon!');
  };

  const handleEnroll = async (courseId) => {
    try {
      if (!currentUser) {
        alert('Please login to enroll in courses');
        return;
      }

      // Temporarily disable API call for debugging
      console.log('Enrollment API call disabled for debugging');

      // For debugging, just update the local state
      setCourses(courses.map(course =>
        course.id === courseId || course._id === courseId
          ? { ...course, isEnrolled: true, status: 'Enrolled' }
          : course
      ));

      alert('Successfully enrolled in course!');

      // Uncomment below to re-enable API call
      /*
      // Call API to enroll
      await coursesAPI.enrollInCourse(courseId);

      // Update local state
      setCourses(courses.map(course =>
        course.id === courseId || course._id === courseId
          ? { ...course, isEnrolled: true, status: 'Enrolled' }
          : course
      ));

      alert('Successfully enrolled in course!');
      */
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  // Filter and sort courses based on search, filters, and enrolled status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filters.level === 'all' || course.level.toLowerCase() === filters.level;
    const matchesEnrolled = !showEnrolledOnly || course.isEnrolled;
    
    return matchesSearch && matchesLevel && matchesEnrolled;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'recent':
        return b.id - a.id; // Assuming higher IDs are more recent
      case 'popular':
        return b.students - a.students;
      default:
        return 0;
    }
  });

  const isTeacher = currentUser?.role === 'teacher';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isTeacher ? 'Manage Courses' : 'Browse Courses'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isTeacher 
              ? 'Create and manage your courses' 
              : 'Find the perfect course to enhance your skills'}
          </p>
        </div>
        
        {isTeacher && (
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={handleCreateCourse}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create New Course
            </button>
          </div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">
              Search courses
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="level" className="sr-only">
              Level
            </label>
            <select
              id="level"
              name="level"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.level}
              onChange={handleFilterChange}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="sr-only">
              Sort by
            </label>
            <select
              id="sortBy"
              name="sortBy"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
        
        {!isTeacher && (
          <div className="mt-4 flex items-center">
            <input
              id="enrolled-only"
              name="enrolled-only"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={showEnrolledOnly}
              onChange={toggleEnrolledOnly}
            />
            <label htmlFor="enrolled-only" className="ml-2 block text-sm text-gray-700">
              Show only my enrolled courses
            </label>
          </div>
        )}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="relative">
              <CourseCard course={course} />
              {!course.isEnrolled && !isTeacher && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="absolute bottom-4 right-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Enroll Now
                </button>
              )}
              {course.isEnrolled && !isTeacher && (
                <span className="absolute bottom-4 right-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Enrolled
                </span>
              )}
              {isTeacher && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-1.5 rounded-full bg-white text-gray-500 hover:bg-gray-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-full bg-white text-gray-500 hover:bg-red-100 hover:text-red-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {showEnrolledOnly 
              ? "You haven't enrolled in any courses yet." 
              : "No courses match your search criteria. Try adjusting your filters."}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setShowEnrolledOnly(false);
                setFilters({
                  level: 'all',
                  category: 'all',
                  sortBy: 'recent',
                });
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {showEnrolledOnly ? 'Browse All Courses' : 'Clear Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
