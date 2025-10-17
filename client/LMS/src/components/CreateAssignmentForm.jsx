import { useState } from 'react';

export default function CreateAssignmentForm(){
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  return (
    <form className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2" placeholder="Assignment Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2" type="datetime-local" value={due} onChange={e=>setDue(e.target.value)} />
      <button type="button" className="px-4 py-2 rounded-lg bg-primary-600 text-white">Add Assignment</button>
      {/* TODO: Submit to backend API */}
    </form>
  );
}
