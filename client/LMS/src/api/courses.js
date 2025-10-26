import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const coursesAPI = {
  // Get all courses
  getAllCourses: async (params = {}) => {
    try {
      console.log('Fetching courses from:', `/courses/getCourses`, 'with params:', params);
      const response = await api.get('/courses/getCourses', { params });
      console.log('Raw API response:', response);

      // Handle backend response format: { success: true, data: courses }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // Fallback for other formats
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get single course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },

  // Enroll in a course
  enrollInCourse: async (courseId) => {
    try {
      console.log('Sending enrollment request for course:', courseId);
      
      // Make sure we're sending the request with credentials
      const response = await api.post('/enrollments/enroll', 
        { courseId },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Enrollment response:', response.data);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || { _id: courseId, enrolled: true }
        };
      }
      
      return {
        success: false,
        error: response.data?.message || 'Failed to enroll in the course.'
      };
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
      
      // Handle 403 Forbidden (likely auth issue)
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Please log in as a student to enroll in courses.',
          requiresAuth: true
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 
               error.message || 
               'Failed to enroll in the course. Please try again.'
      };
    }
  },

  // Get user's enrolled courses
  getMyCourses: async () => {
    try {
      const response = await api.get('/enrollments/my-courses');
      console.log('MyCourses API response:', response);

      // Handle backend response format: { success: true, data: enrollments }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Extract course data from enrollments and add enrollment info
        const courses = response.data.data.map(enrollment => ({
          ...enrollment.course,
          _id: enrollment.course._id,
          enrollmentId: enrollment._id,
          enrolledAt: enrollment.createdAt,
          enrollmentStatus: 'enrolled'
        }));
        return courses;
      }

      // Fallback for other formats
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw error;
    }
  },

  // Search courses
  searchCourses: async (query) => {
    try {
      const response = await api.get('/courses/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  },
};

export default coursesAPI;
