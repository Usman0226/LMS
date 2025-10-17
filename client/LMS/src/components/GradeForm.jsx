import { useState } from 'react';

export default function GradeForm(){
  const [grade, setGrade] = useState('');
  return (
    <form className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2" placeholder="Grade (e.g., A-)" value={grade} onChange={e=>setGrade(e.target.value)} />
      <button type="button" className="px-4 py-2 rounded-lg bg-primary-600 text-white">Save Grade</button>
      {/* TODO: Submit to backend API */}
    </form>
  );
}
