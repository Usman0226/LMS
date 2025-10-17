import CreateCourseForm from '../components/CreateCourseForm';
import CreateAssignmentForm from '../components/CreateAssignmentForm';

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-2xl shadow border border-gray-100">
          <h2 className="font-semibold mb-3">Create Course</h2>
          <CreateCourseForm />
        </div>
        <div className="p-4 bg-white rounded-2xl shadow border border-gray-100">
          <h2 className="font-semibold mb-3">Create Assignment</h2>
          <CreateAssignmentForm />
        </div>
      </section>
    </div>
  );
}
