import CourseCard from './CourseCard';

export default function CourseList({ courses = [] }){
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(c => <CourseCard key={c.id} course={c} />)}
    </div>
  );
}
