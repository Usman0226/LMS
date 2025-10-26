import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseContent } from '../context/CourseContentContext';
import { useCourses } from '../context/CourseContext';
import CourseSidebar from '../components/courseContent/CourseSidebar';
import LessonViewer from '../components/courseContent/LessonViewer';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    courseContent,
    userProgress,
    loading,
    error,
    currentModule,
    currentLesson,
    loadCourseContent,
    loadUserProgress,
    updateLessonProgress,
    setCurrentLessonById,
  } = useCourseContent();

  const { courses } = useCourses();
  const [expandedModules, setExpandedModules] = useState([]);

  // Load course content on mount
  useEffect(() => {
    if (courseId) {
      loadCourseContent(courseId);
      loadUserProgress(courseId);
    }
  }, [courseId, loadCourseContent, loadUserProgress]);

  // Auto-expand current module
  useEffect(() => {
    if (currentModule && !expandedModules.includes(currentModule._id)) {
      setExpandedModules(prev => [...prev, currentModule._id]);
    }
  }, [currentModule, expandedModules]);

  const handleLessonSelect = (module, lesson) => {
    setCurrentLessonById(lesson._id);
  };

  const handleModuleToggle = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || !courseId) return;

    try {
      await updateLessonProgress(courseId, currentLesson._id, {
        completed: true,
        timeSpent: 0 // You could track actual time spent
      });
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  // Find course info
  const course = courses.find(c => c._id === courseId);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Course
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!courseContent || !courseContent.modules?.length) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Content Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This course doesn't have any content yet.
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="btn-primary"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <CourseSidebar
        courseContent={courseContent}
        userProgress={userProgress}
        currentModule={currentModule}
        currentLesson={currentLesson}
        onLessonSelect={handleLessonSelect}
        onModuleToggle={handleModuleToggle}
        expandedModules={expandedModules}
        isLoading={loading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {course?.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userProgress?.overallProgress ? `${Math.round(userProgress.overallProgress)}% Complete` : 'Not started'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/courses')}
                className="btn-secondary"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentLesson ? (
            <LessonViewer
              lesson={currentLesson}
              onComplete={handleLessonComplete}
              isCompleted={userProgress?.completedLessons?.includes(currentLesson._id)}
              progress={userProgress?.overallProgress}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a Lesson
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a lesson from the sidebar to start learning
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;
