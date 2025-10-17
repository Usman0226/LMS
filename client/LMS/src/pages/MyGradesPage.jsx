const dummyGrades = [
  { course: 'Intro to React', grade: 'A-', progress: 85 },
  { course: 'Algorithms', grade: 'B+', progress: 72 },
  { course: 'Linear Algebra', grade: 'A', progress: 91 },
];

export default function MyGradesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Grades</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {dummyGrades.map((g, i) => (
          <div key={i} className="p-4 bg-white rounded-2xl shadow border">
            <h3 className="font-semibold">{g.course}</h3>
            <p className="text-gray-600">Grade: {g.grade}</p>
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div className="h-full bg-primary-600 rounded" style={{ width: `${g.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
