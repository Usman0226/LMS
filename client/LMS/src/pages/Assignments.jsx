import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AssignmentCard from '../components/AssignmentCard';
import { assignmentsAPI } from '../services/api';

// Mock data for assignments
const mockAssignments = [
  {
    id: 1,
    title: 'Assignment 1: Python Basics',
    courseName: 'CS101 - Introduction to Computer Science',
    description: 'Complete the Python exercises on variables, loops, and functions. Submit your solutions as a .py file.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100,
    estimatedTime: '2 hours',
    submitted: false,
    submission: null,
  },
  {
    id: 2,
    title: 'Linear Equations Problem Set',
    courseName: 'MATH201 - Linear Algebra',
    description: 'Solve the system of linear equations using matrix operations. Show all your work.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    points: 100,
    estimatedTime: '3 hours',
    submitted: true,
    submission: {
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      file: 'linear_algebra_solutions.pdf',
      grade: null,
      feedback: null,
    },
  },
  {
    id: 3,
    title: 'Research Paper Outline',
    courseName: 'ENG150 - Academic Writing',
    description: 'Submit an outline for your research paper including thesis statement and main points.',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    points: 50,
    estimatedTime: '1 hour',
    submitted: true,
    submission: {
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      file: 'research_outline.docx',
      grade: 45,
      feedback: 'Great work! Just make sure to add more supporting evidence for your third point.',
    },
  },
  {
    id: 4,
    title: 'Lab Report: Chemical Reactions',
    courseName: 'CHEM201 - Organic Chemistry',
    description: 'Write a lab report on the observed chemical reactions from last week\'s experiment.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    points: 150,
    estimatedTime: '4 hours',
    submitted: false,
    submission: null,
  },
];

export default function Assignments() {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [submissionModal, setSubmissionModal] = useState({
    isOpen: false,
    assignment: null,
    file: null,
    submitting: false,
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

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch this from the API
        // const response = isTeacher 
        //   ? await assignmentsAPI.getAssignmentsToGrade()
        //   : await assignmentsAPI.getAssignments();
        
        // For now, we'll use mock data
        setTimeout(() => {
          setAssignments(mockAssignments);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [isTeacher]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSubmissionModal(prev => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submissionModal.file) return;
    
    try {
      setSubmissionModal(prev => ({ ...prev, submitting: true }));
      
      // In a real app, we would upload the file and submit the assignment
      // const formData = new FormData();
      // formData.append('file', submissionModal.file);
      // await assignmentsAPI.submitAssignment(submissionModal.assignment.id, formData);
      
      // For now, we'll just update the local state
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
    setCreateAssignmentModal({
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
  };

  const openCreateAssignmentModal = () => {
    const defaultCourse = selectedCourse === 'all'
      ? ''
      : (courses.find(course => course.includes(selectedCourse)) || '');
    setCreateAssignmentModal({
      isOpen: true,
      saving: false,
      error: '',
      form: {
        title: '',
        description: '',
        dueDate: '',
        courseName: defaultCourse,
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
    const { title, description, dueDate, courseName } = createAssignmentModal.form;
    if (!title || !description || !dueDate) {
      setCreateAssignmentModal(prev => ({
        ...prev,
        error: 'Please fill in all required fields.',
      }));
      return;
    }

    setCreateAssignmentModal(prev => ({
      ...prev,
      saving: true,
      error: '',
    }));

    const newAssignment = {
      id: Date.now(),
      title,
      courseName: courseName || 'General',
      description,
      dueDate: new Date(dueDate).toISOString(),
      submitted: false,
      submission: null,
    };

    try {
      setAssignments(prev => [newAssignment, ...prev]);
      resetCreateAssignmentModal();
    } catch (error) {
      setCreateAssignmentModal(prev => ({
        ...prev,
        saving: false,
        error: 'Failed to create assignment. Please try again.',
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
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

      {/* Submission Modal */}
      {submissionModal.isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSubmissionModal({ isOpen: false, assignment: null, file: null })}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {submissionModal.assignment?.submitted ? 'Assignment Details' : 'Submit Assignment'}
                    </h3>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">{submissionModal.assignment?.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{submissionModal.assignment?.courseName}</p>
                      <p className="mt-3 text-sm text-gray-700">{submissionModal.assignment?.description}</p>
                      
                      {submissionModal.assignment?.submitted ? (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <h5 className="font-medium text-gray-900">Your Submission</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            Submitted on {new Date(submissionModal.assignment.submission.submittedAt).toLocaleDateString()}
                          </p>
                          <div className="mt-2 flex items-center">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-900">
                              {submissionModal.assignment.submission.file}
                            </span>
                          </div>
                          
                          {submissionModal.assignment.submission.grade !== null && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Grade:</span>
                                <span className="font-medium text-gray-900">
                                  {submissionModal.assignment.submission.grade} / {submissionModal.assignment.points}
                                </span>
                              </div>
                              {submissionModal.assignment.submission.feedback && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Feedback:</p>
                                  <p className="mt-1 text-sm text-gray-600">
                                    {submissionModal.assignment.submission.feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload your submission
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                >
                                  <span>Upload a file</span>
                                  <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file" 
                                    className="sr-only"
                                    onChange={handleFileChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX, PPT, PPTX up to 10MB
                              </p>
                            </div>
                          </div>
                          {submissionModal.file && (
                            <div className="mt-2 flex items-center text-sm text-gray-900">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {submissionModal.file.name}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!submissionModal.assignment?.submitted ? (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      onClick={handleSubmitAssignment}
                      disabled={!submissionModal.file || submissionModal.submitting}
                    >
                      {submissionModal.submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setSubmissionModal({ isOpen: false, assignment: null, file: null })}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setSubmissionModal({ isOpen: false, assignment: null, file: null })}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {createAssignmentModal.isOpen && (
        <div className="fixed z-20 inset-0 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={resetCreateAssignmentModal}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="create-assignment-title">
                          Create New Assignment
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Provide assignment details and choose a course to add it to your list.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={resetCreateAssignmentModal}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {createAssignmentModal.error && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {createAssignmentModal.error}
                      </div>
                    )}

                    <form onSubmit={handleCreateAssignmentSubmit} className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="create-assignment-title-input">
                          Title *
                        </label>
                        <input
                          id="create-assignment-title-input"
                          type="text"
                          value={createAssignmentModal.form.title}
                          onChange={(e) => handleCreateAssignmentInputChange('title', e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter assignment title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="create-assignment-course-input">
                          Course
                        </label>
                        <input
                          id="create-assignment-course-input"
                          type="text"
                          list="assignment-course-options"
                          value={createAssignmentModal.form.courseName}
                          onChange={(e) => handleCreateAssignmentInputChange('courseName', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Course name (e.g., CS101 - Intro to CS)"
                        />
                        <datalist id="assignment-course-options">
                          {courses.map(course => (
                            <option key={course} value={course} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="create-assignment-due-input">
                          Due Date *
                        </label>
                        <input
                          id="create-assignment-due-input"
                          type="datetime-local"
                          value={createAssignmentModal.form.dueDate}
                          onChange={(e) => handleCreateAssignmentInputChange('dueDate', e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="create-assignment-description-input">
                          Description *
                        </label>
                        <textarea
                          id="create-assignment-description-input"
                          rows={4}
                          value={createAssignmentModal.form.description}
                          onChange={(e) => handleCreateAssignmentInputChange('description', e.target.value)}
                          required
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Describe the assignment requirements"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={resetCreateAssignmentModal}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={createAssignmentModal.saving}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {createAssignmentModal.saving ? 'Saving...' : 'Create Assignment'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
