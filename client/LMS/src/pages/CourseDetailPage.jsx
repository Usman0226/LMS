import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, assignmentsAPI } from '../services/api';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentSubmissionForm from '../components/AssignmentSubmissionForm';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const courseResponse = await coursesAPI.getCourseById(courseId);
        setCourse(courseResponse.data.data);

        // Fetch assignments for this course
        const assignmentsResponse = await assignmentsAPI.getAssignments(courseId);
        setAssignments(assignmentsResponse.data.data || []);

        // If user is a teacher, fetch enrolled students
        if (currentUser?.role === 'teacher') {
          try {
            const studentsResponse = await coursesAPI.getEnrolledStudents(courseId);
            setEnrolledStudents(studentsResponse.data.data || []);
          } catch (error) {
            console.log('Error fetching enrolled students:', error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, currentUser]);

  const handleAssignmentCreated = (newAssignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setShowAssignmentForm(false);
  };

  const handleSubmissionComplete = (submission) => {
    // Update assignment status or refresh data
    console.log('Assignment submitted:', submission);
    setSelectedAssignment(null);
  };

  const isTeacher = currentUser?.role === 'teacher';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
        <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
        <Link to="/courses" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-gray-600">{course.description}</p>
          {course.duration && (
            <p className="mt-1 text-sm text-gray-500">Duration: {course.duration}</p>
          )}
        </div>
        <Link to="/courses" className="text-primary-600 hover:text-primary-700">
          ← Back to Courses
        </Link>
      </div>

      {/* Tabs for different views */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assignments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assignments ({assignments.length})
          </button>
          {isTeacher && (
            <>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students ({enrolledStudents.length})
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                View Submissions
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Assignment Creation Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <AssignmentForm
              courseId={courseId}
              onAssignmentCreated={handleAssignmentCreated}
              onClose={() => setShowAssignmentForm(false)}
            />
          </div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <AssignmentSubmissionForm
              assignment={selectedAssignment}
              onSubmissionComplete={handleSubmissionComplete}
              onClose={() => setSelectedAssignment(null)}
            />
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Course Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700">Course Details</h4>
              <p className="mt-2 text-gray-600">{course.description}</p>
              {course.duration && (
                <p className="mt-2 text-sm text-gray-500">Duration: {course.duration}</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Enrollment</h4>
              <p className="mt-2 text-gray-600">
                {enrolledStudents.length} students enrolled
              </p>
              <p className="mt-2 text-gray-600">
                {assignments.length} assignments available
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
            {isTeacher && (
              <button
                onClick={() => setShowAssignmentForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Assignment
              </button>
            )}
          </div>

          {assignments.length > 0 ? (
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <div key={assignment._id} className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                      <p className="mt-1 text-gray-600">{assignment.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>Points: {assignment.points}</span>
                        <span>Status: {assignment.status || 'Active'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      {!isTeacher && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isTeacher ? 'Create your first assignment for this course.' : 'No assignments have been posted yet.'}
              </p>
              {isTeacher && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowAssignmentForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Create Assignment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'students' && isTeacher && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Enrolled Students ({enrolledStudents.length})
            </h3>
            {enrolledStudents.length > 0 ? (
              <div className="space-y-3">
                {enrolledStudents.map((student) => (
                  <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students have enrolled in this course yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'submissions' && isTeacher && (
        <div className="text-center py-8">
          <Link
            to={`/courses/${courseId}/submissions`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View All Submissions
          </Link>
        </div>
      )}
    </div>
  );
}
