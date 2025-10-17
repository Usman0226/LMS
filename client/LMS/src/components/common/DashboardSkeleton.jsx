import React from 'react';

export const StatCardSkeleton = () => (
  <div className="h-32 rounded-2xl bg-surface-muted animate-pulse"></div>
);

export const CourseCardSkeleton = () => (
  <div className="space-y-3 p-4 border border-border-subtle rounded-2xl">
    <div className="h-6 w-3/4 bg-surface-muted rounded animate-pulse"></div>
    <div className="h-4 w-full bg-surface-muted rounded animate-pulse"></div>
    <div className="h-4 w-1/2 bg-surface-muted rounded animate-pulse"></div>
    <div className="pt-2">
      <div className="h-2 w-full bg-surface-muted rounded-full animate-pulse mb-1"></div>
      <div className="h-2 w-3/4 bg-surface-muted rounded-full animate-pulse"></div>
    </div>
  </div>
);

export const AssignmentRowSkeleton = () => (
  <div className="p-4 border border-border-subtle rounded-xl">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-5 w-3/4 bg-surface-muted rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-surface-muted rounded animate-pulse"></div>
      </div>
      <div className="h-8 w-24 bg-surface-muted rounded-full animate-pulse"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Header */}
    <div className="space-y-4">
      <div className="h-8 w-64 bg-surface-muted rounded"></div>
      <div className="h-4 w-3/4 bg-surface-muted rounded"></div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Courses */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-surface-muted rounded"></div>
          <div className="h-9 w-32 bg-surface-muted rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
      
      {/* Assignments */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-surface-muted rounded"></div>
          <div className="h-9 w-20 bg-surface-muted rounded-full"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <AssignmentRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
