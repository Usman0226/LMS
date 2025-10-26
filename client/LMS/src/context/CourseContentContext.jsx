import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import courseContentAPI from '../api/courseContent';

// Track if we've shown errors
let hasShownError = false;

const CourseContentContext = createContext();

export const CourseContentProvider = ({ children }) => {
  const { currentUser, refreshToken } = useAuth();

  // Course Content State
  const [courseContent, setCourseContent] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Current viewing state
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

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

  // Load course content
  const loadCourseContent = useCallback(async (courseId) => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Loading course content for course:', courseId);
      const content = await courseContentAPI.getCourseContent(courseId);

      if (isMounted.current) {
        setCourseContent(content.data);
        console.log('Course content loaded:', content.data);
      }
      return content;
    } catch (err) {
      console.error('Failed to load course content:', err);

      if (!isMounted.current) return;

      // Handle token expiration (401 errors)
      if (err.response?.status === 401) {
        console.log('🔄 Token expired, attempting refresh...');
        try {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            console.log('✅ Token refreshed, retrying course content request...');
            // Retry the original request
            return await loadCourseContent(courseId);
          } else {
            console.log('❌ Token refresh failed');
            setError('Session expired. Please log in again.');
            return null;
          }
        } catch (refreshError) {
          console.error('❌ Token refresh error:', refreshError);
          setError('Session expired. Please log in again.');
          return null;
        }
      }

      let errorMessage = 'Failed to load course content. Please try again later.';

      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Could not connect to the server. Please make sure the backend server is running on http://localhost:3000';
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Please log in to view course content';
            break;
          case 404:
            errorMessage = 'Course content not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      }

      setError(errorMessage);
      return null;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load user progress
  const loadUserProgress = useCallback(async (courseId) => {
    if (!currentUser || !isMounted.current) return;

    try {
      const progress = await courseContentAPI.getUserProgress(courseId);
      if (isMounted.current) {
        setUserProgress(progress.data);
      }
      return progress;
    } catch (err) {
      console.error('Failed to load user progress:', err);
      // Don't show error for progress loading failure
      return null;
    }
  }, [currentUser]);

  // Update lesson progress
  const updateLessonProgress = async (courseId, lessonId, progressData) => {
    try {
      const result = await courseContentAPI.updateLessonProgress(courseId, lessonId, progressData);

      // Update local progress state
      if (result.success && userProgress) {
        const updatedProgress = {
          ...userProgress,
          completedLessons: progressData.completed
            ? [...(userProgress.completedLessons || []), lessonId]
            : (userProgress.completedLessons || []).filter(id => id !== lessonId),
          lastAccessed: new Date()
        };

        // Calculate overall progress
        if (courseContent) {
          const totalLessons = courseContent.totalLessons || 0;
          const completedLessons = updatedProgress.completedLessons?.length || 0;
          updatedProgress.overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
        }

        setUserProgress(updatedProgress);
      }

      return result;
    } catch (err) {
      console.error('Failed to update lesson progress:', err);
      throw err;
    }
  };

  // Create module
  const createModule = async (courseId, moduleData) => {
    try {
      const result = await courseContentAPI.createModule(courseId, moduleData);

      if (result.success && courseContent) {
        const updatedContent = {
          ...courseContent,
          modules: [...(courseContent.modules || []), result.data]
        };
        setCourseContent(updatedContent);
      }

      return result;
    } catch (err) {
      console.error('Failed to create module:', err);
      throw err;
    }
  };

  // Create lesson
  const createLesson = async (courseId, moduleId, lessonData) => {
    try {
      const result = await courseContentAPI.createLesson(courseId, moduleId, lessonData);

      if (result.success && courseContent) {
        const updatedContent = {
          ...courseContent,
          modules: courseContent.modules?.map(module =>
            module._id === moduleId
              ? { ...module, lessons: [...(module.lessons || []), result.data] }
              : module
          ) || []
        };
        setCourseContent(updatedContent);
      }

      return result;
    } catch (err) {
      console.error('Failed to create lesson:', err);
      throw err;
    }
  };

  // Submit quiz
  const submitQuiz = async (courseId, quizId, answers) => {
    try {
      const result = await courseContentAPI.submitQuiz(courseId, quizId, answers);

      if (result.success && userProgress) {
        const updatedProgress = {
          ...userProgress,
          quizScores: {
            ...userProgress.quizScores,
            [quizId]: result.data.score
          }
        };
        setUserProgress(updatedProgress);
      }

      return result;
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      throw err;
    }
  };

  // Set current lesson
  const setCurrentLessonById = (lessonId) => {
    if (!courseContent) return;

    for (const module of courseContent.modules || []) {
      const lesson = module.lessons?.find(l => l._id === lessonId);
      if (lesson) {
        setCurrentModule(module);
        setCurrentLesson(lesson);
        break;
      }
    }
  };

  // Calculate module progress
  const getModuleProgress = (moduleId) => {
    if (!userProgress || !courseContent) return 0;

    const module = courseContent.modules?.find(m => m._id === moduleId);
    if (!module || !module.lessons) return 0;

    const completedLessons = module.lessons.filter(lesson =>
      userProgress.completedLessons?.includes(lesson._id)
    ).length;

    return module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0;
  };

  const value = {
    // State
    courseContent,
    userProgress,
    loading,
    error,
    currentModule,
    currentLesson,

    // Actions
    loadCourseContent,
    loadUserProgress,
    updateLessonProgress,
    createModule,
    createLesson,
    submitQuiz,
    setCurrentLessonById,
    getModuleProgress,

    // Computed values
    isEnrolled: !!userProgress,
    hasContent: !!courseContent?.modules?.length,
    totalModules: courseContent?.modules?.length || 0,
    totalLessons: courseContent?.totalLessons || 0,
    overallProgress: userProgress?.overallProgress || 0,
  };

  return (
    <CourseContentContext.Provider value={value}>
      {children}
    </CourseContentContext.Provider>
  );
};

export const useCourseContent = () => {
  const context = useContext(CourseContentContext);
  if (!context) {
    throw new Error('useCourseContent must be used within a CourseContentProvider');
  }
  return context;
};

export default CourseContentContext;
