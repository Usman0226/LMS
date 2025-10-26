import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import coursesAPI from '../api/courses';
import axios from 'axios';

// Track if we've shown the server connection error
let hasShownServerError = false;

const   CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { currentUser, refreshToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    searchQuery: '',
    sortBy: 'newest',
  });

  // Use ref to track mounted state
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset isMounted when component mounts/updates
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    console.log('🚀 Starting fetchCourses with filters:', filters);
    console.log('📊 Current courses state before fetch:', courses);
    console.log('🔄 isMounted.current:', isMounted.current);

    if (isMounted.current) {
      setLoading(true);
      setError(null);
      console.log('✅ Set loading to true');
    }

    try {
      const response = await coursesAPI.getAllCourses(filters);
      console.log('📡 Raw API response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response keys:', response ? Object.keys(response) : 'null');

      // Ensure we have valid data before updating state
      if (isMounted.current) {
        // Check if the response has a data property that contains the courses array
        let coursesData = [];

        if (Array.isArray(response)) {
          coursesData = response;
          console.log('✅ Response is direct array');
        } else if (response && response.data && Array.isArray(response.data.data)) {
          // Handle nested structure: { data: { success: true, data: [...] } }
          coursesData = response.data.data;
          console.log('✅ Found nested array at response.data.data');
        } else if (response && Array.isArray(response.data)) {
          // Handle direct array in response.data
          coursesData = response.data;
          console.log('✅ Found array at response.data');
        } else if (response && response.data) {
          // Handle object response - try to extract courses array
          coursesData = response.data;
          console.log('✅ Using response.data as courses');
        } else {
          console.log('❌ No valid courses data found');
          console.log('📊 Response structure:', JSON.stringify(response, null, 2));
        }

        console.log('📊 Final coursesData:', coursesData);
        console.log('📊 coursesData length:', coursesData.length);
        console.log('📊 coursesData type:', Array.isArray(coursesData));

        setCourses(coursesData);
        hasShownServerError = false;
        console.log('✅ Successfully set courses state');
      }
      return response;
    } catch (err) {
      console.error('❌ Error in fetchCourses:', err);

      if (!isMounted.current) {
        console.log('⚠️ Component unmounted, skipping error handling');
        return [];
      }

      // Handle token expiration (401 errors)
      if (err.response?.status === 401) {
        console.log('🔄 Token expired, attempting refresh...');
        try {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            console.log('✅ Token refreshed, retrying request...');
            // Retry the original request
            return await fetchCourses();
          } else {
            console.log('❌ Token refresh failed');
            // Redirect to login or show login prompt
            window.location.href = '/login';
            return [];
          }
        } catch (refreshError) {
          console.error('❌ Token refresh error:', refreshError);
          window.location.href = '/login';
          return [];
        }
      }

      let errorMessage = 'Failed to load courses. Please try again later.';

      if (err.code === 'ERR_NETWORK') {
        errorMessage = `Could not connect to the server. Please make sure the backend server is running on ${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`;
      } else if (err.response) {
        console.log('❌ API Error response:', err.response);
        // Handle different HTTP status codes
        switch (err.response.status) {
          case 401:
            errorMessage = 'Please log in to view courses';
            break;
          case 404:
            errorMessage = 'Courses not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }

      if (isMounted.current) {
        setError(errorMessage);
        setCourses([]);
        console.log('❌ Set error and cleared courses');
      }
      return [];
    } finally {
      if (isMounted.current) {
        setLoading(false);
        console.log('✅ Set loading to false');
      }
    }
  }, [filters, refreshToken]);

  // Fetch user's enrolled courses
  const fetchMyCourses = useCallback(async () => {
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await coursesAPI.getMyCourses();
      console.log('MyCourses API response:', response);

      // Handle different response formats
      let coursesData = [];
      if (Array.isArray(response)) {
        coursesData = response;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (response && Array.isArray(response.data)) {
        coursesData = response.data;
      } else if (response && response.data) {
        coursesData = response.data;
      }

      if (isMounted.current) {
        setCourses(coursesData);
        setError(null);
      }
      console.log('Set courses from fetchMyCourses:', coursesData);
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
      if (isMounted.current) {
        setError('Failed to load your courses. Please try again later.');
        setCourses([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [coursesAPI]);

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    try {
      console.log('Enrolling in course:', courseId);
      const result = await coursesAPI.enrollInCourse(courseId);
      
      // If we get a requiresAuth flag, redirect to login
      if (result.requiresAuth) {
        // This will be handled by the AuthContext
        return result;
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to enroll in course');
      }

      // Update the course in the courses list to reflect enrollment
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course._id === courseId
            ? {
                ...course,
                students: [...(course.students || []), currentUser?._id].filter(Boolean),
                isEnrolled: true,
                enrollmentStatus: 'enrolled'
              }
            : course
        )
      );

      console.log('Successfully enrolled in course:', courseId);
      return { success: true, data: result.data };
    } catch (err) {
      console.error('Enrollment failed:', err);

      // Handle token expiration (401 errors)
      if (err.response?.status === 401) {
        console.log('🔄 Token expired during enrollment, attempting refresh...');
        try {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            console.log('✅ Token refreshed, retrying enrollment...');
            // Retry the enrollment
            return await enrollInCourse(courseId);
          } else {
            console.log('❌ Token refresh failed');
            return {
              success: false,
              error: 'Session expired. Please log in again.'
            };
          }
        } catch (refreshError) {
          console.error('❌ Token refresh error:', refreshError);
          return {
            success: false,
            error: 'Session expired. Please log in again.'
          };
        }
      }

      return {
        success: false,
        error: err.response?.data?.message || 'Failed to enroll in the course.'
      };
    }
  };

  // Search courses
  const searchCourses = async (query) => {
    try {
      setLoading(true);
      const data = await coursesAPI.searchCourses(query);
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [filters]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        filters,
        updateFilters,
        fetchCourses,
        fetchMyCourses,
        enrollInCourse,
        searchCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export default CourseContext;
