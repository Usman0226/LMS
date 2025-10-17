import { useState } from 'react';

export default function SubmitAssignmentForm({ assignmentId }){
  const [link, setLink] = useState('');
  return (
    <form className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2" placeholder="Submission link" value={link} onChange={e=>setLink(e.target.value)} />
      <button type="button" className="px-4 py-2 rounded-lg bg-primary-600 text-white">Submit</button>
      {/* TODO: Submit to backend API with assignmentId */}
    </form>
  );
}
