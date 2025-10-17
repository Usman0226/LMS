export default function SubmissionList({ submissions = [] }){
  return (
    <ul className="divide-y divide-gray-200">
      {submissions.map(s => (
        <li key={s.id} className="py-3 flex items-center justify-between">
          <div>
            <p className="font-medium">{s.student}</p>
            <p className="text-sm text-gray-500">{s.time}</p>
          </div>
          <a className="text-primary-600 hover:underline" href={s.link}>View</a>
        </li>
      ))}
    </ul>
  );
}
