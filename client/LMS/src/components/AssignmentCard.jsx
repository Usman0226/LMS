import { Link } from 'react-router-dom';
import { ClockIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function AssignmentCard({ assignment }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (dueDate, submitted) => {
    if (submitted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Submitted
        </span>
      );
    }
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Overdue
        </span>
      );
    } else if (diffDays <= 2) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Due soon
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{assignment.courseName}</p>
        </div>
        {getStatusBadge(assignment.dueDate, assignment.submitted)}
      </div>
      
      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
        {assignment.description || 'No description provided.'}
      </p>
      
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>Due {formatDate(assignment.dueDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{assignment.points || 100} points</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{assignment.estimatedTime || '1 hour'}</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Link
          to={`/assignments/${assignment.id}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {assignment.submitted ? 'View Submission' : 'View Assignment'}
        </Link>
      </div>
    </div>
  );
}

// Default props for the component
AssignmentCard.defaultProps = {
  assignment: {
    id: 1,
    title: 'Assignment 1: Introduction to React',
    courseName: 'CS101 - Introduction to Computer Science',
    description: 'Build a simple React application with at least 3 components and implement state management.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    points: 100,
    estimatedTime: '3 hours',
    submitted: false
  }
};
