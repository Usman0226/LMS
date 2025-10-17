export default function StudentProgressCard({ progress }){
  const percent = Math.round((progress.completed / progress.total) * 100 || 0);
  return (
    <div className="p-4 bg-white rounded-2xl shadow border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Progress</h3>
        <span className="text-sm text-gray-600">Grade: {progress.grade}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded">
        <div className="h-full bg-primary-600 rounded" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-gray-600">{progress.completed} of {progress.total} completed</p>
    </div>
  );
}
