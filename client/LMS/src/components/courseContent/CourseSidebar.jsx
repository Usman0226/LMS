import { ChevronDown, ChevronRight, Play, CheckCircle, Clock, BookOpen } from 'lucide-react';

const CourseSidebar = ({
  courseContent,
  userProgress,
  currentModule,
  currentLesson,
  onLessonSelect,
  onModuleToggle,
  expandedModules,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseContent) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <p className="text-gray-500 text-center">No course content available</p>
      </div>
    );
  }

  const getModuleProgress = (module) => {
    if (!userProgress || !module.lessons) return 0;

    const completedLessons = module.lessons.filter(lesson =>
      userProgress.completedLessons?.includes(lesson._id)
    ).length;

    return module.lessons.length > 0 ? (completedLessons / module.lessons.length) * 100 : 0;
  };

  const isLessonCompleted = (lessonId) => {
    return userProgress?.completedLessons?.includes(lessonId) || false;
  };

  const isLessonCurrent = (lesson) => {
    return currentLesson?._id === lesson._id;
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Course Content
        </h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{courseContent.totalLessons || 0} lessons</span>
          <span className="mx-1">•</span>
          <span>{Math.round(courseContent.totalDuration / 60) || 0} hours</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {courseContent.modules?.map((module) => {
          const isExpanded = expandedModules.includes(module._id);
          const progress = getModuleProgress(module);

          return (
            <div key={module._id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              {/* Module Header */}
              <button
                onClick={() => onModuleToggle(module._id)}
                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                    <BookOpen className="h-4 w-4 text-primary-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {module.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                {module.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                    {module.description}
                  </p>
                )}
              </button>

              {/* Module Lessons */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {module.lessons?.map((lesson) => {
                    const isCompleted = isLessonCompleted(lesson._id);
                    const isCurrent = isLessonCurrent(lesson);

                    return (
                      <button
                        key={lesson._id}
                        onClick={() => onLessonSelect(module, lesson)}
                        className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          isCurrent ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Play className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={`text-sm ${
                              isCurrent
                                ? 'text-primary-700 dark:text-primary-300 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lesson.duration && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {lesson.duration}m
                              </span>
                            )}
                            {lesson.isPreview && (
                              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                                Preview
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseSidebar;
