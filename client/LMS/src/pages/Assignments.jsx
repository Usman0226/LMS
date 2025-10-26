import { Fragment, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AssignmentCard from '../components/AssignmentCard';
import { SkeletonGrid, SkeletonAssignmentCard, EmptyAssignments } from '../components/ui';
import { assignmentsAPI, coursesAPI } from '../services/api';
import { XMarkIcon, PlusIcon, DocumentTextIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';

// Helper function to format assignment data for the AssignmentCard
const formatAssignmentData = (assignment) => {
  const hasSubmission = assignment.submissions && assignment.submissions.length > 0;
  const submission = hasSubmission ? assignment.submissions[0] : null;
  
  return {
    id: assignment._id,
    title: assignment.title,
    courseName: assignment.course?.title || 'Unassigned Course',
    description: assignment.description || 'No description provided.',
    dueDate: assignment.dueDate,
    points: assignment.points || 100,
    estimatedTime: assignment.estimatedTime || '1-2 hours',
    submitted: hasSubmission,
    submission: submission ? {
      submittedAt: submission.submittedAt,
      file: submission.file || 'submission.txt',
      grade: submission.grade,
      feedback: submission.feedback
    } : null
  };
};

export default function Assignments() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [submissionModal, setSubmissionModal] = useState({
    isOpen: false,
    assignment: null,
    file: null,
    submitting: false,
    error: null,
    fileError: null,
    uploadProgress: 0
  });
  const [createAssignmentModal, setCreateAssignmentModal] = useState({
    isOpen: false,
    saving: false,
    error: '',
    form: {
      title: '',
      description: '',
      dueDate: '',
      courseName: '',
    },
  });

  const isTeacher = currentUser?.role === 'teacher';

  // Fetch teacher's courses
  const fetchTeacherCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await coursesAPI.getTeacherCourses();
      if (response.data && response.data.success) {
        setTeacherCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (currentUser.role === 'teacher') {
        // For teachers, get all submissions they need to grade
        response = await assignmentsAPI.getSubmissions();
      } else {
        // For students, get their assigned assignments
        response = await assignmentsAPI.getAssignments();
      }
      
      if (response.data && response.data.success) {
        // Format each assignment for the AssignmentCard
        const formattedAssignments = Array.isArray(response.data.data) 
          ? response.data.data.map(formatAssignmentData)
          : [];
          
        setAssignments(formattedAssignments);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError(error.message || 'Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (isTeacher) {
        fetchTeacherCourses();
      }
      fetchAssignments();
    }
  }, [currentUser, isTeacher]);

  const validateFile = (file) => {
    if (!file) return 'Please select a file to upload';
    if (file.size > 5 * 1024 * 1024) return 'File size should be less than 5MB';
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and Word documents are allowed';
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileError = validateFile(file);
    
    setSubmissionModal(prev => ({
      ...prev,
      file,
      fileError,
      error: null
    }));
  };

  const handleSubmitAssignment = async () => {
    if (!submissionModal.file) {
      setSubmissionModal(prev => ({
        ...prev,
        fileError: 'Please select a file to upload',
      }));
      return;
    }

    if (submissionModal.fileError) return;

    try {
      setSubmissionModal(prev => ({ ...prev, 
        submitting: true, 
        error: null,
        uploadProgress: 0
      }));
      
      const formData = new FormData();
      formData.append('file', submissionModal.file);
      formData.append('submittedAt', new Date().toISOString());

      const response = await assignmentsAPI.submitAssignment(
        submissionModal.assignment.id, 
        formData,
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setSubmissionModal(prev => ({
            ...prev,
            uploadProgress: progress
          }));
        }
      );
      
      // Update local state with the new submission
      const updatedAssignments = assignments.map(assignment => 
        assignment.id === submissionModal.assignment.id
          ? {
              ...assignment,
              submitted: true,
              submission: {
                submittedAt: new Date().toISOString(),
                file: submissionModal.file.name,
                grade: null,
                feedback: null,
              },
            }
          : assignment
      );
      
      setAssignments(updatedAssignments);
      setSubmissionModal({ 
        isOpen: false, 
        assignment: null, 
        file: null, 
        submitting: false,
        error: null,
        fileError: null,
        uploadProgress: 0
      });

    } catch (error) {
      console.error('Error submitting assignment:', error);
      setSubmissionModal(prev => ({
        ...prev,
        submitting: false,
        error: error.response?.data?.message || 'Failed to submit assignment. Please try again.',
        uploadProgress: 0
      }));
    }
      // For now, we'll just update the local state
      try{
      const updatedAssignments = assignments.map(assignment => 
        assignment.id === submissionModal.assignment.id
          ? {
              ...assignment,
              submitted: true,
              submission: {
                submittedAt: new Date().toISOString(),
                file: submissionModal.file.name,
                grade: null, 
                feedback: null,
              },
            }
          : assignment
      );
      
      setAssignments(updatedAssignments);
      setSubmissionModal({ isOpen: false, assignment: null, file: null, submitting: false });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setSubmissionModal(prev => ({ ...prev, submitting: false }));
    }
  };

  // Filter assignments based on active tab and selected course
  const filteredAssignments = assignments.filter(assignment => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    // Filter by tab
    if (activeTab === 'upcoming' && (assignment.submitted || dueDate < now)) {
      return false;
    }
    if (activeTab === 'submitted' && !assignment.submitted) {
      return false;
    }
    if (activeTab === 'graded' && (!assignment.submitted || !assignment.submission?.grade)) {
      return false;
    }
    if (activeTab === 'overdue' && (assignment.submitted || dueDate >= now)) {
      return false;
    }
    
    // Filter by course
    if (selectedCourse !== 'all' && !assignment.courseName.includes(selectedCourse)) {
      return false;
    }
    
    return true;
  });

  // Get unique course names for the filter dropdown
  const courses = [...new Set(assignments.map(a => a.courseName))];

  const resetCreateAssignmentModal = () => {
    setCreateAssignmentModal(prev => ({
      ...prev,
      isOpen: false,
      saving: false,
      error: '',
      form: {
        title: '',
        description: '',
        dueDate: '',
        courseId: teacherCourses[0]?._id || '',
      },
    }));
  };

  const openCreateAssignmentModal = () => {
    setCreateAssignmentModal({
      isOpen: true,
      saving: false,
      error: '',
      form: {
        title: '',
        description: '',
        dueDate: '',
        courseId: teacherCourses[0]?._id || '',
      },
    });
  };

  const handleCreateAssignmentInputChange = (field, value) => {
    setCreateAssignmentModal(prev => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value,
      },
    }));
  };

  const handleCreateAssignmentSubmit = async (e) => {
    e.preventDefault();
    const { title, description, dueDate, courseId } = createAssignmentModal.form;
    
    if (!title || !description || !dueDate || !courseId) {
      setCreateAssignmentModal(prev => ({
        ...prev,
        error: 'Please fill in all required fields.',
      }));
      return;
    }

    try {
      setCreateAssignmentModal(prev => ({
        ...prev,
        saving: true,
        error: '',
      }));

      const response = await assignmentsAPI.createAssignment({
        courseId,
        title,
        description,
        dueDate: new Date(dueDate).toISOString()
      });

      if (response.data && response.data.success) {
        // Fetch updated assignments
        await fetchAssignments();
        resetCreateAssignmentModal();
      } else {
        throw new Error(response.data?.message || 'Failed to create assignment');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      setCreateAssignmentModal(prev => ({
        ...prev,
        saving: false,
        error: error.message || 'Failed to create assignment. Please try again.',
      }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {['Upcoming', 'Submitted', 'Graded', 'Overdue'].map((tab) => (
              <div key={tab} className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64 mb-4 sm:mb-0">
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mr-2"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonAssignmentCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isTeacher ? 'Assignments to Grade' : 'My Assignments'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isTeacher 
              ? 'Review and grade student submissions' 
              : 'Track and submit your assignments'}
          </p>
        </div>
        
        {isTeacher && (
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={openCreateAssignmentModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create New Assignment
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { name: 'Upcoming', tab: 'upcoming' },
            { name: 'Submitted', tab: 'submitted' },
            { name: 'Graded', tab: 'graded' },
            { name: 'Overdue', tab: 'overdue' },
          ].map((tab) => (
            <button
              key={tab.tab}
              onClick={() => setActiveTab(tab.tab)}
              className={`${
                activeTab === tab.tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.name}
              {tab.tab === 'overdue' && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {assignments.filter(a => {
                    const due = new Date(a.dueDate);
                    return !a.submitted && due < new Date();
                  }).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-64 mb-4 sm:mb-0">
          <label htmlFor="course-filter" className="sr-only">
            Filter by course
          </label>
          <select
            id="course-filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course.split(' - ')[0]}>
                {course}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">
            {filteredAssignments.length} {filteredAssignments.length === 1 ? 'assignment' : 'assignments'}
          </span>
          <button
            type="button"
            className="ml-2 p-2 text-gray-400 hover:text-gray-500"
            title="Refresh"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-700 hover:text-red-900 font-medium"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAssignments.length === 0 && (
        <EmptyAssignments
          isTeacher={isTeacher}
          onCreateAssignment={() => setCreateAssignmentModal({ ...createAssignmentModal, isOpen: true })}
          onViewAssignments={() => setActiveTab('upcoming')}
        />
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {!loading && !error ? filteredAssignments.length > 0 && (
          filteredAssignments.map((assignment) => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              onViewSubmission={() => {
                if (assignment.submitted) {
                  // Navigate to submission details or show in modal
                  setSubmissionModal({
                    isOpen: true,
                    assignment,
                    file: null,
                    submitting: false,
                  });
                } else {
                  // Show submission modal
                  setSubmissionModal({
                    isOpen: true,
                    assignment,
                    file: null,
                    submitting: false,
                  });
                }
              }}
            />
          ))
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No assignments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'upcoming' 
                ? 'You have no upcoming assignments.'
                : activeTab === 'submitted'
                ? 'You have no submitted assignments.'
                : activeTab === 'graded'
                ? 'No graded assignments yet.'
                : 'No overdue assignments.'}
            </p>
            {activeTab !== 'upcoming' && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('upcoming')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Upcoming Assignments
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      <Transition.Root show={createAssignmentModal.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={resetCreateAssignmentModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Create New Assignment
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Fill in the details below to create a new assignment.
                        </p>
                      </div>

                      {createAssignmentModal.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex">
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{createAssignmentModal.error}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <form className="mt-4 space-y-4" onSubmit={handleCreateAssignmentSubmit}>
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors ${
                              createAssignmentModal.form.title ? 'border-gray-300' : 'border-red-300'
                            }`}
                            value={createAssignmentModal.form.title}
                            onChange={(e) => handleCreateAssignmentInputChange('title', e.target.value)}
                            disabled={createAssignmentModal.saving}
                            required
                            placeholder="Enter assignment title"
                            aria-describedby="title-error"
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={createAssignmentModal.form.description}
                            onChange={(e) => handleCreateAssignmentInputChange('description', e.target.value)}
                            disabled={createAssignmentModal.saving}
                          />
                        </div>

                        <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                            Due Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="datetime-local"
                            id="dueDate"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={createAssignmentModal.form.dueDate}
                            onChange={(e) => handleCreateAssignmentInputChange('dueDate', e.target.value)}
                            disabled={createAssignmentModal.saving}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
                            Course <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="courseId"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={createAssignmentModal.form.courseId}
                            onChange={(e) => handleCreateAssignmentInputChange('courseId', e.target.value)}
                            disabled={createAssignmentModal.saving || loadingCourses}
                            required
                          >
                            <option value="">Select a course</option>
                            {teacherCourses.map((course) => (
                              <option key={course._id} value={course._id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                          <button
                            type="submit"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white transition-colors sm:col-start-2 sm:text-sm ${
                              createAssignmentModal.saving
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                            }`}
                            disabled={createAssignmentModal.saving || loadingCourses}
                          >
                            {createAssignmentModal.saving ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Creating...
                              </>
                            ) : (
                              <>
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                Create Assignment
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors"
                            onClick={resetCreateAssignmentModal}
                            disabled={createAssignmentModal.saving}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Submission Modal */}
      <Transition.Root show={submissionModal.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => !submissionModal.submitting && setSubmissionModal(prev => ({ ...prev, isOpen: false }))}
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {submissionModal.assignment?.submitted ? 'View Submission' : 'Submit Assignment'}
                      </Dialog.Title>
                      <div className="mt-2">
                        {submissionModal.assignment?.submitted ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-sm font-medium text-green-900">Assignment Submitted</span>
                              </div>
                              <p className="text-sm text-green-700 mt-1">
                                Submitted on: {new Date(submissionModal.assignment.submission.submittedAt).toLocaleString()}
                              </p>
                            </div>
                            {submissionModal.assignment.submission.file && (
                              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center">
                                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                                  <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-xs">
                                    {submissionModal.assignment.submission.file}
                                  </span>
                                </div>
                                <a
                                  href={`/api/assignments/submissions/${submissionModal.assignment.submission.file}/download`}
                                  className="ml-4 flex-shrink-0 text-sm font-medium text-primary-600 hover:text-primary-500"
                                >
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-400 transition-colors">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none hover:text-primary-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleFileChange}
                                      accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                      disabled={submissionModal.submitting}
                                      aria-describedby="file-upload-description"
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500" id="file-upload-description">PDF, DOC, DOCX up to 5MB</p>
                              </div>
                            </div>
                            {submissionModal.file && (
                              <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                                <div className="flex items-center">
                                  <DocumentTextIcon className="h-5 w-5 text-green-500" />
                                  <span className="ml-2 text-sm font-medium text-green-700 truncate max-w-xs">
                                    {submissionModal.file.name}
                                  </span>
                                  <span className="ml-2 text-xs text-green-600">
                                    {(submissionModal.file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="ml-4 flex-shrink-0 text-sm font-medium text-green-600 hover:text-green-500"
                                  onClick={() => setSubmissionModal(prev => ({ ...prev, file: null, fileError: null }))}
                                  disabled={submissionModal.submitting}
                                >
                                  Change
                                </button>
                              </div>
                            )}
                            {submissionModal.uploadProgress > 0 && submissionModal.uploadProgress < 100 && (
                              <div className="mt-2">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Uploading...</span>
                                  <span>{submissionModal.uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${submissionModal.uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {submissionModal.fileError && (
                              <p className="mt-1 text-sm text-red-600">{submissionModal.fileError}</p>
                            )}
                            {submissionModal.error && (
                              <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">{submissionModal.error}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    {!submissionModal.assignment?.submitted && (
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 sm:col-start-2 sm:text-sm transition-colors"
                        onClick={handleSubmitAssignment}
                        disabled={submissionModal.submitting || !submissionModal.file || !!submissionModal.fileError}
                      >
                        {submissionModal.submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {submissionModal.uploadProgress > 0 ? 'Uploading...' : 'Submitting...'}
                          </>
                        ) : (
                          'Submit Assignment'
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm transition-colors"
                      onClick={() => setSubmissionModal(prev => ({ ...prev, isOpen: false }))}
                      disabled={submissionModal.submitting}
                    >
                      {submissionModal.assignment?.submitted ? 'Close' : 'Cancel'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
