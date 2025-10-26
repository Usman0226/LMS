import { Link } from 'react-router-dom';

export default function CourseCard({ course, onEnroll, isStudent, isEnrolled, isLoading }) {
  return (
    <div
      className="
        group relative 
        w-full max-w-[320px] sm:max-w-[360px] md:max-w-[400px] 
        min-h-[260px] md:min-h-[300px]
        rounded-2xl bg-white border border-white/20 shadow-md
        overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:-translate-y-2 hover:shadow-xl hover:border-violet-400/30
      "
    >
      <div
        className="
          absolute inset-0 opacity-0 
          bg-[linear-gradient(120deg,rgba(255,255,255,0)_40%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0)_60%)]
          bg-[length:200%_100%]
          group-hover:opacity-100 animate-[shine_3s_infinite]
          pointer-events-none
        "
      ></div>

      {/* Glow overlay */}
      <div
        className="
          absolute inset-[-10px] opacity-0 group-hover:opacity-100
          bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.3)_0%,rgba(249,115,22,0)_70%)]
          transition-opacity duration-500 pointer-events-none
        "
      ></div>

      <div className="relative p-5 flex flex-col gap-3 z-[2] h-full">
        {/* Gradient Header */}
        <div
          className="
            h-36 sm:h-40 md:h-44
            rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 
            flex items-center justify-center text-center
            transition-transform duration-500 
            hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg
          "
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white px-4 leading-snug">
            {course.code}: {course.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className="
            text-slate-600 text-sm sm:text-[15px] opacity-70 
            transition-all duration-300 hover:opacity-100 hover:translate-x-[2px] 
            line-clamp-2
          "
        >
          {course.description || 'No description available'}
        </p>

        {/* Instructor / Credits */}
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <span>Teacher: {course.teacher?.name || course.instructor || 'Not assigned'}</span>
          <span>{course.credits || 3} credits</span>
        </div>

        {/* Duration / Level */}
        {course.duration && course.level && (
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
            <span>Duration: {course.duration}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-[10px] sm:text-xs font-medium">
              {course.level}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center gap-2 mt-auto">
          {isEnrolled ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Enrolled
            </span>
          ) : (
            isStudent &&
            onEnroll && (
              <button
                onClick={() => onEnroll(course.id || course._id)}
                disabled={isLoading}
                className={`
                  inline-flex items-center justify-center 
                  w-8 h-8 rounded-full bg-orange-600 text-white 
                  transition-all duration-300 transform scale-90
                  hover:scale-100 hover:shadow-[0_0_0_4px_rgba(124,58,237,0.2)]
                  active:scale-95
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    height="16"
                    width="16"
                    viewBox="0 0 24 24"
                    className="animate-[pulse_1.5s_infinite]"
                  >
                    <path
                      strokeWidth="2"
                      stroke="currentColor"
                      d="M4 12H20M12 4V20"
                      fill="currentColor"
                    ></path>
                  </svg>
                )}
              </button>
            )
          )}
          <Link
            to={`/courses/${course.id || course._id}`}
            className="
              text-orange-600 hover:text-orange-700 font-semibold 
              text-sm sm:text-base transition-colors
            "
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

CourseCard.defaultProps = {
  course: {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description:
      'An introductory course covering fundamental concepts of computer science and programming.',
    instructor: 'Dr. Smith',
    credits: 3,
    duration: '10 weeks',
    level: 'Beginner',
    isNew: true,
  },
  isEnrolled: false,
  isLoading: false,
};
