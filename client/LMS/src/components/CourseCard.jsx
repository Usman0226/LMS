import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <div className="card overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div className="h-40 bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
        <h3 className="text-2xl font-bold text-white text-center px-4">
          {course.code}: {course.title}
        </h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description || 'No description available'}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Instructor: {course.instructor}</span>
          <span>{course.credits || 3} credits</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {course.status || 'Enrolled'}
          </span>
          <Link
            to={`/courses/${course.id}`}
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Default props for the component
CourseCard.defaultProps = {
  course: {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'An introductory course covering fundamental concepts of computer science and programming.',
    instructor: 'Dr. Smith',
    credits: 3,
    status: 'In Progress'
  }
};
