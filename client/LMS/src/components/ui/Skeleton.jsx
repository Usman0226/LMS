import React from 'react';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Base skeleton component
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

// Text skeleton for different text sizes
export const SkeletonText = ({ lines = 1, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

// Avatar skeleton
export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <Skeleton className={`rounded-full ${sizeClasses[size]} ${className}`} />
  );
};

// Button skeleton
export const SkeletonButton = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-12 px-6'
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-md ${className}`} />
  );
};

// Card skeleton
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <SkeletonAvatar size="md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-20" />
          <SkeletonButton size="sm" />
        </div>
      </div>
    </div>
  );
};

// Course card skeleton
export const SkeletonCourseCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-soft border border-gray-200 overflow-hidden ${className}`}>
      {/* Course Image */}
      <div className="h-40 bg-gray-200 relative rounded-t-3xl">
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="flex items-center text-sm space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Instructor */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Assignment card skeleton
export const SkeletonAssignmentCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex space-x-2">
            <SkeletonButton size="sm" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

// List item skeleton
export const SkeletonListItem = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-4 p-4 ${className}`}>
      <SkeletonAvatar size="sm" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
};

// Table skeleton
export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Table header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} className="h-4 w-full" />
          ))}
        </div>
      </div>
      {/* Table rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`h-4 ${colIndex === 0 ? 'w-3/4' : 'w-full'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard stats skeleton
export const SkeletonStats = ({ count = 4, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 shadow-sm">
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="ml-5 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Generic grid skeleton
export const SkeletonGrid = ({ items = 6, ItemSkeleton = SkeletonCard, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <ItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default Skeleton;

// Enhanced empty state component
export const EmptyState = ({
  icon: Icon = BookOpenIcon,
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        <Icon className="h-full w-full" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {actionText}
        </button>
      )}
    </div>
  );
};

// Specific empty states for different sections
export const EmptyCourses = ({ isTeacher = false, onCreateCourse, onBrowseCourses }) => {
  const Icon = isTeacher ? AcademicCapIcon : BookOpenIcon;
  const title = isTeacher ? 'No courses created yet' : 'No courses enrolled';
  const description = isTeacher
    ? 'Start by creating your first course to share your knowledge with students.'
    : 'Browse available courses and enroll in ones that interest you.';
  const actionText = isTeacher ? 'Create Your First Course' : 'Browse All Courses';

  return (
    <EmptyState
      icon={Icon}
      title={title}
      description={description}
      actionText={actionText}
      onAction={isTeacher ? onCreateCourse : onBrowseCourses}
    />
  );
};

export const EmptyAssignments = ({ isTeacher = false, onCreateAssignment, onViewAssignments }) => {
  const Icon = ClipboardDocumentListIcon;
  const title = isTeacher ? 'No assignments created' : 'No assignments due';
  const description = isTeacher
    ? 'Create assignments to assess your students\' understanding and progress.'
    : 'You have completed all your assignments. Great job!';
  const actionText = isTeacher ? 'Create New Assignment' : 'View All Assignments';

  return (
    <EmptyState
      icon={Icon}
      title={title}
      description={description}
      actionText={actionText}
      onAction={isTeacher ? onCreateAssignment : onViewAssignments}
    />
  );
};

export const EmptyGrades = ({ onViewGrades }) => {
  return (
    <EmptyState
      icon={ChartBarIcon}
      title="No grades available"
      description="Grades will appear here once your assignments are submitted and graded by your instructors."
      actionText="View Grade History"
      onAction={onViewGrades}
    />
  );
};

export const EmptySubmissions = ({ onGradeSubmissions }) => {
  return (
    <EmptyState
      icon={DocumentTextIcon}
      title="No submissions to grade"
      description="Student submissions will appear here when they submit their assignments."
      actionText="Refresh Submissions"
      onAction={onGradeSubmissions}
    />
  );
};

export const EmptyForum = ({ onCreatePost }) => {
  return (
    <EmptyState
      icon={UserGroupIcon}
      title="No discussions yet"
      description="Be the first to start a discussion or ask a question in this forum."
      actionText="Start Discussion"
      onAction={onCreatePost}
    />
  );
};
