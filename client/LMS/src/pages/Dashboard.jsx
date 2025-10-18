import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import AssignmentCard from '../components/AssignmentCard';
import { coursesAPI, assignmentsAPI } from '../services/api';

// Mock data for courses and assignments
const mockCourses = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science and programming with Python.',
    instructor: 'Dr. Sarah Johnson',
    credits: 4,
    status: 'In Progress',
    progress: 65,
  },
  {
    id: 2,
    code: 'MATH201',
    title: 'Linear Algebra',
    description: 'Study vectors, matrices, and linear transformations with real-world applications.',
    instructor: 'Prof. Michael Chen',
    credits: 3,
    status: 'In Progress',
    progress: 30,
  },
];

const mockAssignments = [
  {
    id: 1,
    title: 'Assignment 1: Python Basics',
    courseName: 'CS101 - Introduction to Computer Science',
    description: 'Complete the Python exercises on variables, loops, and functions.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100,
    estimatedTime: '2 hours',
    submitted: false,
  },
  {
    id: 2,
    title: 'Linear Equations Problem Set',
    courseName: 'MATH201 - Linear Algebra',
    description: 'Solve the system of linear equations using matrix operations.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100,
    estimatedTime: '3 hours',
    submitted: true,
  },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesInProgress: 0,
    assignmentsDue: 0,
    completedCourses: 0,
    averageGrade: 0,
    coursesCreated: 0,
    totalStudents: 0,
    assignmentsToGrade: 0,
    averageClassSize: 0,
  });

  // Handle protected actions
  const handleProtectedAction = (action, path) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Perform the action or navigate
    if (path) {
      navigate(path);
    }
  };

  const handleViewAllCourses = () => handleProtectedAction('viewCourses', '/courses');
  const handleCreateCourse = () => handleProtectedAction('createCourse', '/courses');
  const handleBrowseCourses = () => handleProtectedAction('browseCourses', '/courses');
  const handleCreateAssignment = () => handleProtectedAction('createAssignment', '/assignments');
  const handleGradeSubmissions = () => handleProtectedAction('gradeSubmissions', '/grades');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Dashboard - Starting data fetch for user:', currentUser);

        // Use mock data for now to prevent crashes
        setTimeout(() => {
          if (isTeacher) {
            // Teacher-specific stats
            setStats({
              coursesCreated: 3,
              totalStudents: 45,
              assignmentsToGrade: 12,
              averageClassSize: 15,
              // Keep student stats as 0 for teachers
              coursesInProgress: 0,
              assignmentsDue: 0,
              completedCourses: 0,
              averageGrade: 0,
            });
          } else {
            // Student-specific stats
            setStats({
              coursesInProgress: 2,
              assignmentsDue: 3,
              completedCourses: 4,
              averageGrade: 87.5,
              // Keep teacher stats as 0 for students
              coursesCreated: 0,
              totalStudents: 0,
              assignmentsToGrade: 0,
              averageClassSize: 0,
            });
          }

          setCourses(mockCourses);
          setAssignments(mockAssignments);
          setLoading(false);
          console.log('Dashboard - Mock data loaded successfully');
        }, 500);

        // Uncomment below to re-enable API calls
        /*
        // Try to fetch real data if user is logged in
        if (currentUser) {
          try {
            if (isTeacher) {
              // Teachers see all courses they created
              const coursesRes = await coursesAPI.getAllCourses();
              setCourses(coursesRes.data.data || []);
            } else {
              // Students see their enrolled courses first
              const enrolledRes = await coursesAPI.getEnrolledCourses();
              const enrolledCourses = enrolledRes.data.data || [];
              setCourses(enrolledCourses);
            }

            // Fetch assignments for all users
            const assignmentsRes = await assignmentsAPI.getAssignments();
            setAssignments(assignmentsRes.data.data || []);
          } catch (apiError) {
            console.log('API not available, using mock data');
            setCourses(mockCourses);
            setAssignments(mockAssignments);
          }
        } else {
          // Use mock data for preview
          setCourses(mockCourses);
          setAssignments(mockAssignments);
        }

        setStats({
          coursesInProgress: 2,
          assignmentsDue: 3,
          completedCourses: 4,
          averageGrade: 87.5,
          coursesCreated: 0,
          totalStudents: 0,
          assignmentsToGrade: 0,
          averageClassSize: 0,
        });
        setLoading(false);
        */
      } catch (error) {
        console.error('Error in Dashboard fetchDashboardData:', error);
        // Fallback to mock data on any error
        setCourses(mockCourses);
        setAssignments(mockAssignments);
        // Set default stats based on user role
        if (isTeacher) {
          setStats({
            coursesCreated: 0,
            totalStudents: 0,
            assignmentsToGrade: 0,
            averageClassSize: 0,
            coursesInProgress: 0,
            assignmentsDue: 0,
            completedCourses: 0,
            averageGrade: 0,
          });
        } else {
          setStats({
            coursesInProgress: 0,
            assignmentsDue: 0,
            completedCourses: 0,
            averageGrade: 0,
            coursesCreated: 0,
            totalStudents: 0,
            assignmentsToGrade: 0,
            averageClassSize: 0,
          });
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const isTeacher = currentUser?.role === 'teacher';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="mt-2 text-gray-600">
          {isTeacher 
            ? 'Here\'s what\'s happening with your classes today.'
            : 'Here\'s your learning progress and upcoming deadlines.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isTeacher ? [
          {
            name: 'Courses Created',
            value: '3',
            change: 'Active courses',
            icon: '📚',
            color: 'bg-blue-100 text-blue-800',
          },
          {
            name: 'Total Students',
            value: '45',
            change: 'Across all courses',
            icon: '👥',
            color: 'bg-green-100 text-green-800',
          },
          {
            name: 'Assignments to Grade',
            value: '12',
            change: 'Pending submissions',
            icon: '📝',
            color: 'bg-yellow-100 text-yellow-800',
          },
          {
            name: 'Average Class Size',
            value: '15',
            change: 'Students per course',
            icon: '📊',
            color: 'bg-purple-100 text-purple-800',
          },
        ] : [
          {
            name: 'Courses in Progress',
            value: '2',
            change: '+2 from last month',
            icon: '📚',
            color: 'bg-blue-100 text-blue-800',
          },
          {
            name: 'Assignments Due',
            value: '3',
            change: '3 due this week',
            icon: '📝',
            color: 'bg-yellow-100 text-yellow-800',
          },
          {
            name: 'Completed Courses',
            value: '4',
            change: 'Last completed: CS101',
            icon: '✅',
            color: 'bg-green-100 text-green-800',
          },
          {
            name: 'Average Grade',
            value: '87.5%',
            change: '+2.5% from last term',
            icon: '📊',
            color: 'bg-purple-100 text-purple-800',
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.color}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isTeacher ? 'Your Courses' : 'My Courses'}
            </h2>
            <button
              type="button"
              onClick={handleViewAllCourses}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <li key={course.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {course.code}: {course.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {course.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {course.instructor}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {course.credits} credits
                          </p>
                        </div>
                        {isTeacher ? (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span className="text-blue-600 font-medium">{course.students || 0} students</span>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-primary-600 h-2.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span>{course.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="px-4 py-12 text-center">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isTeacher
                      ? 'Get started by creating a new course.'
                      : 'You are not enrolled in any courses yet.'}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={isTeacher ? handleCreateCourse : handleBrowseCourses}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {isTeacher ? 'Create New Course' : 'Browse All Courses'}
                    </button>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isTeacher ? 'Recent Activity' : 'Upcoming Assignments'}
          </h2>
          <button
            type="button"
            onClick={() => handleProtectedAction('viewAssignments', '/assignments')}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View All
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {assignments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {assignment.courseName}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.submitted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span className="mx-1">•</span>
                      <span>{assignment.points} points</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {isTeacher ? 'No recent activity' : 'No assignments'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isTeacher
                  ? 'Activity will appear here as students interact with your courses.'
                  : 'You have no upcoming assignments due.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions for Teachers */}
        {isTeacher && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleCreateAssignment}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create New Assignment
              </button>
              <button
                type="button"
                onClick={handleGradeSubmissions}
                className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Grade Submissions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
