import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SubmitAssignmentForm from '../components/SubmitAssignmentForm';
import SubmissionList from '../components/SubmissionList';

const dummyAssignment = {
  id: 'a1',
  title: 'Build a Todo App',
  description: 'Implement add/remove/toggle with persistence',
  dueDate: new Date(Date.now()+7*864e5).toISOString(),
  submissions: [
    { id: 's1', student: 'Alex Kim', time: '2025-10-01 12:30', link: '#' },
    { id: 's2', student: 'Priya Singh', time: '2025-10-02 09:15', link: '#' },
  ],
};

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const { isTeacher } = useAuth();
  const a = dummyAssignment; // TODO replace with API call using assignmentId
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{a.title}</h1>
        <p className="text-gray-600">Due: {new Date(a.dueDate).toLocaleString()}</p>
        <p className="mt-2">{a.description}</p>
      </div>
      {isTeacher ? (
        <div className="p-4 bg-white rounded-2xl border shadow">
          <h2 className="font-semibold mb-2">Submissions</h2>
          <SubmissionList submissions={a.submissions} />
        </div>
      ) : (
        <div className="p-4 bg-white rounded-2xl border shadow">
          <h2 className="font-semibold mb-2">Submit your work</h2>
          <SubmitAssignmentForm assignmentId={a.id} />
        </div>
      )}
    </div>
  );
}
