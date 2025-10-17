import CourseList from '../components/CourseList';

const dummyCourses = [
  { id: 'c1', title: 'Intro to React', description: 'Components, hooks, and patterns', duration: '6h' },
  { id: 'c2', title: 'Data Structures', description: 'Arrays, trees, graphs', duration: '8h' },
  { id: 'c3', title: 'Linear Algebra', description: 'Vectors, matrices', duration: '10h' },
];

export default function CourseListPage() {
  return (
    <div className="min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <CourseList courses={dummyCourses} />
    </div>
  );
}
