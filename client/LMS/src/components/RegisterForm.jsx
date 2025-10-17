import { useState } from 'react';

export default function RegisterForm({ onSubmit }){
  const [role, setRole] = useState('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const tabBase = 'px-4 py-2 text-sm font-medium rounded-md transition';
  const tabActive = 'bg-slate-700 text-white shadow';
  const tabInactive = 'text-gray-400 hover:text-white';

  function submit(e){
    e.preventDefault();
    onSubmit?.({ role, firstName, lastName, email, password, confirmPassword, terms });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex justify-center">
        <div className="bg-slate-800 p-1 rounded-full flex gap-2 border border-slate-700">
          <button type="button" className={`${tabBase} ${role==='student'?tabActive:tabInactive}`} onClick={()=>setRole('student')}>Student</button>
          <button type="button" className={`${tabBase} ${role==='teacher'?tabActive:tabInactive}`} onClick={()=>setRole('teacher')}>Teacher</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} />
      </div>
      <input className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-3">
        <input type="password" className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input type="password" className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
      </div>
      <label className="flex items-start gap-3 text-slate-300 text-sm">
        <input type="checkbox" className="mt-1 accent-indigo-600" checked={terms} onChange={e=>setTerms(e.target.checked)} />
        <span> I agree to the <a className="text-indigo-400 hover:underline" href="#">Terms</a> and <a className="text-indigo-400 hover:underline" href="#">Privacy Policy</a>.</span>
      </label>
      <button className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 transition rounded-lg py-3 text-white font-semibold w-full">Create Account</button>
    </form>
  );
}
