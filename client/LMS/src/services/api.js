import axios from 'axios';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Update this with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include credentials for cookies
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions for authentication
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// API functions for courses
export const coursesAPI = {
  getAllCourses: () =>
    api.get('/courses/getCourses'),
  
  getCourseById: (id) =>
    api.get(`/courses/${id}`),
  
  createCourse: (courseData) =>
    api.post('/courses/create', courseData),
  
  updateCourse: (id, courseData) =>
    api.put(`/courses/${id}`, courseData),
  
  deleteCourse: (id) =>
    api.delete(`/courses/${id}`),
  
  enrollInCourse: (courseId) =>
    api.post(`/enrollments/enroll`, { courseId }),
  
  getEnrolledCourses: () =>
    api.get('/enrollments/my-courses'),
  
  getEnrolledStudents: (courseId) =>
    api.get(`/enrollments/${courseId}/students`),
};

// API functions for assignments
export const assignmentsAPI = {
  getAssignments: (courseId) =>
    courseId
      ? api.get(`/assignments/${courseId}`)
      : api.get('/assignments'),
  
  getAssignmentById: (id) =>
    api.get(`/assignments/${id}`),
  
  createAssignment: (assignmentData) =>
    api.post('/assignments/create', assignmentData),
  
  updateAssignment: (id, assignmentData) =>
    api.put(`/assignments/${id}`, assignmentData),
  
  deleteAssignment: (id) =>
    api.delete(`/assignments/${id}`),
  
  submitAssignment: (id, submissionData) =>
    api.post(`/submissions/submit-assign`, submissionData),
  
  getSubmissions: (courseId) =>
    api.get(`/submissions/course/${courseId}`),
  
  getSubmissionById: (id) =>
    api.get(`/submissions/${id}`),
};

// API functions for grades
export const gradesAPI = {
  getGrades: (courseId) => 
    courseId 
      ? api.get(`/grades?courseId=${courseId}`)
      : api.get('/grades'),
    
  getGradeForAssignment: (assignmentId) => 
    api.get(`/grades/assignments/${assignmentId}`),
    
  submitGrade: (submissionId, gradeData) => 
    api.post(`/grades/submissions/${submissionId}`, gradeData),
};

// API functions for forum
export const forumAPI = {
  getThreads: (courseId) => 
    api.get(`/forum/threads?courseId=${courseId}`),
    
  getThread: (threadId) => 
    api.get(`/forum/threads/${threadId}`),
    
  createThread: (threadData) => 
    api.post('/forum/threads', threadData),
    
  replyToThread: (threadId, replyData) => 
    api.post(`/forum/threads/${threadId}/replies`, replyData),
    
  deleteThread: (threadId) => 
    api.delete(`/forum/threads/${threadId}`),
};

export default api;
