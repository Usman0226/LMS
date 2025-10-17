import { useParams, Link } from 'react-router-dom';
import AssignmentCard from '../components/AssignmentCard';

const dummyCourse = {
  id: 'c1',
  title: 'Intro to React',
  description: 'Build modern UIs with React and hooks.',
  assignments: [
    { id: 'a1', title: 'Build a Todo App', dueDate: new Date(Date.now()+7*864e5).toISOString(), status: 'pending' },
    { id: 'a2', title: 'State Management', dueDate: new Date(Date.now()+14*864e5).toISOString(), status: 'open' },
  ],
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = dummyCourse; // TODO: replace with API call using courseId
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Assignments</h2>
          <Link to="/courses" className="text-primary-600 hover:underline">Back to Courses</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {course.assignments.map(a => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
