import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { assignmentsAPI } from '../services/api';
import { SkeletonStats, SkeletonCard, SkeletonListItem, EmptyCourses, EmptyAssignments, DashboardErrorBoundary } from '../components/ui';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusIcon,
  ArrowUpRightIcon,
  ArrowPathIcon,
  UserCircleIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Course and assignment data will be fetched from the API

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { courses, loading: coursesLoading, fetchCourses, fetchMyCourses } = useCourses();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isTeacher = currentUser?.role === 'teacher';

  // Stats data with enhanced styling and icons
  const [stats, setStats] = useState([
    {
      name: 'Enrolled Courses',
      value: 0,
      icon: BookOpenIcon,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: 'up',
      change: 'Loading...',
      key: 'enrolledCourses',
      action: () => navigate('/courses'),
      description: 'View all your courses'
    },
    {
      name: 'Assignments Due',
      value: 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      trend: 'up',
      change: 'Loading...',
      key: 'assignmentsDue',
      action: () => navigate('/assignments'),
      description: 'Check your assignments'
    },
    {
      name: 'Courses Completed',
      value: 0,
      icon: CheckCircleIcon,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: 'up',
      change: 'Loading...',
      key: 'coursesCompleted',
      action: () => navigate('/my-courses'),
      description: 'Review completed courses'
    },
    {
      name: 'Learning Hours',
      value: 0,
      icon: ClockIcon,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: 'up',
      change: 'Loading...',
      key: 'learningHours',
      action: () => navigate('/profile'),
      description: 'View your progress'
    },
  ]);

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  const handleCreateAssignment = () => {
    navigate('/assignments');
  };

  const handleGradeSubmissions = () => {
    navigate('/assignments');
  };

  useEffect(() => {
    if (!currentUser) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Dashboard - Fetching data for user:', currentUser);

        // Fetch courses using CourseContext
        if (isTeacher) {
          await fetchCourses();
        } else {
          await fetchMyCourses();
        }

        // Fetch assignments
        setAssignmentsLoading(true);
        try {
          const assignmentsRes = await assignmentsAPI.getAssignments();
          const assignmentsData = assignmentsRes.data?.data || assignmentsRes.data || [];
          setAssignments(assignmentsData);
        } catch (assignmentError) {
          console.error('Failed to fetch assignments:', assignmentError);
          setAssignments([]);
        } finally {
          setAssignmentsLoading(false);
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser, isTeacher, fetchCourses, fetchMyCourses]);

  // Update stats when courses or assignments data changes
  useEffect(() => {
    if (!loading && !coursesLoading && !assignmentsLoading) {
      setStats(prevStats => prevStats.map(stat => {
        switch(stat.key) {
          case 'enrolledCourses':
            return { ...stat, value: courses.length, change: isTeacher ? 'Your courses' : 'Enrolled' };
          case 'assignmentsDue':
            const dueAssignments = assignments.filter(a => new Date(a.dueDate) > new Date()).length;
            return { ...stat, value: dueAssignments, change: dueAssignments > 0 ? `${dueAssignments} due` : 'All caught up!' };
          case 'coursesCompleted':
            const completedCourses = isTeacher ? 0 : courses.filter(course => course.progress === 100).length;
            return { ...stat, value: completedCourses, change: completedCourses > 0 ? 'Great progress!' : 'Keep going!' };
          case 'learningHours':
            const learningHours = isTeacher ? 0 : courses.reduce((sum, course) => sum + (course.hoursSpent || 0), 0);
            return {
              ...stat,
              value: Math.round(learningHours * 10) / 10,
              change: learningHours > 0 ? 'Keep it up!' : 'Start learning!'
            };
          default:
            return stat;
        }
      }));
    }
  }, [courses, assignments, loading, coursesLoading, assignmentsLoading, isTeacher]);

  if (loading || coursesLoading || assignmentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-80 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <SkeletonStats count={4} className="mb-8" />

          {/* Courses Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonListItem key={index} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonListItem key={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton for Teachers */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 gap-3">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Welcome back, {currentUser?.name || 'Student'}! 
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Here's what's happening with your learning journey today
              </p>
            </div>
            {isTeacher && (
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => navigate('/courses/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New Course
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isLastStat = index === stats.length - 1;
            return (
              <div
                key={stat.name}
                onClick={stat.action}
                className={`relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:scale-105 cursor-pointer ${isLastStat ? 'lg:col-span-1' : ''}`}
              >
                <div className="flex items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} shadow-sm`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
                    <dd className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      {stat.trend && (
                        <span className="ml-2 flex items-center text-xs font-medium text-green-600">
                          {stat.trend === 'up' ? (
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="ml-1">{stat.change}</span>
                        </span>
                      )}
                    </dd>
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  </div>
                </div>
                {/* Hover indicator */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Courses and Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Courses */}
          <div className='mt-4'>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {isTeacher ? 'Your Courses' : 'My Courses'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/my-courses')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View All
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {courses.length > 0 ? (
                  courses.slice(0, 3).map((course) => (
                    <li
                      key={course._id}
                      onClick={() => navigate('/my-courses')}
                      className="px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 truncate hover:text-primary-800 transition-colors">
                          {course.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {isTeacher ? 'Teaching' : 'Enrolled'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {course.teacher?.name || 'Unknown Teacher'}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {course.duration || 'Self-paced'}
                          </p>
                        </div>
                        {isTeacher ? (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span className="text-blue-600 font-medium">{course.students?.length || 0} students</span>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                            </div>
                            <span>{course.progress || 0}%</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <EmptyCourses
                    isTeacher={isTeacher}
                    onCreateCourse={() => navigate('/courses/create')}
                    onBrowseCourses={() => navigate('/my-courses')}
                  />
                )}
              </ul>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className='mt-4'>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {isTeacher ? 'Recent Activity' : 'Upcoming Assignments'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/assignments')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View All
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {assignments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {assignments.slice(0, 3).map((assignment) => (
                    <li
                      key={assignment._id}
                      onClick={() => navigate(`/assignments/${assignment._id}`)}
                      className="px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate hover:text-primary-600 transition-colors">
                            {assignment.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {assignment.course?.title || 'Unknown Course'}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {(() => {
                            const isOverdue = new Date(assignment.dueDate) < new Date();
                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                isOverdue
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}>
                                {isOverdue ? 'Overdue' : 'Pending'}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          <span className="mx-1">•</span>
                          <span>{assignment.points || 100} points</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyAssignments
                  isTeacher={isTeacher}
                  onCreateAssignment={() => navigate('/assignments')}
                  onViewAssignments={() => navigate('/assignments')}
                />
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
      </div>
      </div>
    </DashboardErrorBoundary>
);
}
