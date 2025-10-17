import { useState } from 'react';

export default function CreateCourseForm(){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  return (
    <form className="space-y-3">
      <input className="w-full border rounded-lg px-3 py-2" placeholder="Course Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button type="button" className="px-4 py-2 rounded-lg bg-primary-600 text-white">Add Course</button>
      {/* TODO: Submit to backend API */}
    </form>
  );
}
