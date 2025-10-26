import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentsAPI } from '../services/api';
import { 
  PlusIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const CourseAssignments = () => {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filter !== 'all' && { filter })
      };
      
      console.log('Fetching assignments with params:', { courseId, params });
      
      // Make the API call - using the correct endpoint that matches backend
      const response = await api.get(`/assignments/${courseId}`, { params });
      console.log('API Response:', response);
      
      // Handle response based on the actual structure
      if (response.data && response.data.success) {
        // If the response has a data array, use it directly
        const assignmentsData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [];
          
        setAssignments(assignmentsData);
        
        // Update pagination if available, otherwise use defaults
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || assignmentsData.length,
          totalPages: response.data.pagination?.totalPages || 1
        }));
      } else {
        throw new Error(response.data?.message || 'No data received from server');
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
    }
  }, [courseId, filter, pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (assignment) => {
    if (currentUser?.role === 'teacher') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {assignment.submissions?.length || 0} submissions
        </span>
      );
    }

    const submission = assignment.submissions?.[0];
    if (!submission) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="h-3 w-3 mr-1" />
          Not Submitted
        </span>
      );
    }

    if (submission.status === 'submitted') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Submitted
        </span>
      );
    }

    if (submission.status === 'graded') {
      return (
        <div className="flex flex-col">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-1">
            Graded: {submission.grade}
          </span>
          {submission.feedback && (
            <span className="text-xs text-gray-500">Feedback available</span>
          )}
        </div>
      );
    }

    return null;
  };

  // Debug logs
  console.log('Component state:', { 
    assignments, 
    loading, 
    error, 
    courseId,
    filter,
    pagination 
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state is now handled in the main return

  // If there's an error, show it
  if (error && !loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchAssignments}
                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Course Assignments</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all assignments for this course
          </p>
        </div>
        {currentUser?.role === 'teacher' && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}/assignments/create`)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Assignment
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Assignments
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'upcoming'
              ? 'bg-green-100 text-green-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'past'
              ? 'bg-yellow-100 text-yellow-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Past Due
        </button>
      </div>

      {/* Assignments List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Assignment
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-3 py-6 text-center text-sm text-gray-500">
                        No assignments found
                      </td>
                    </tr>
                  ) : (
                    assignments.map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {assignment.title}
                              </div>
                              <div className="text-gray-500 truncate max-w-xs">
                                {assignment.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                            {formatDate(assignment.dueDate)}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getStatusBadge(assignment)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {currentUser?.role === 'teacher' ? (
                            <Link
                              to={`/courses/${courseId}/assignments/${assignment._id}/submissions`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Submissions
                            </Link>
                          ) : (
                            <Link
                              to={`/courses/${courseId}/assignments/${assignment._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {assignment.submissions?.length ? 'View' : 'Submit'}
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">
                  {assignments.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
                </span>{' '}
                to <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAssignments;
