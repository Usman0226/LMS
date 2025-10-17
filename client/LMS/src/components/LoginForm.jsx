import { useState } from 'react';

export default function LoginForm({ onSubmit }){
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const tabBase = 'px-4 py-2 text-sm font-medium rounded-md transition';
  const tabActive = 'bg-slate-700 text-white shadow';
  const tabInactive = 'text-gray-400 hover:text-white';

  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.({ role, email, password });}} className="space-y-5">
      <div className="flex justify-center">
        <div className="bg-slate-800 p-1 rounded-full flex gap-2 border border-slate-700">
          <button type="button" className={`${tabBase} ${role==='student'?tabActive:tabInactive}`} onClick={()=>setRole('student')}>Student</button>
          <button type="button" className={`${tabBase} ${role==='teacher'?tabActive:tabInactive}`} onClick={()=>setRole('teacher')}>Teacher</button>
        </div>
      </div>
      <input className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 transition rounded-lg py-3 text-white font-semibold w-full">Sign In</button>
    </form>
  );
}
