import CourseCard from '../components/CourseCard';
import StudentProgressCard from '../components/StudentProgressCard';

const dummyEnrolled = [
  { id: 'c1', title: 'Intro to React', description: 'Hooks and components', duration: '6h' },
  { id: 'c2', title: 'Algorithms', description: 'Sorting, searching', duration: '9h' },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <StudentProgressCard progress={{ grade: 'A-', completed: 6, total: 10 }} />
        <StudentProgressCard progress={{ grade: 'B+', completed: 3, total: 7 }} />
        <StudentProgressCard progress={{ grade: 'A', completed: 9, total: 12 }} />
      </div>
      <section>
        <h2 className="text-lg font-semibold mb-3">Enrolled Courses</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {dummyEnrolled.map(c => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
