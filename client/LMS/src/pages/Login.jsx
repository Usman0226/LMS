import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correctly imports the hook
import Ball from '../components/Ball.jsx';
const tabBase = 'px-4 py-2 text-sm font-semibold rounded-full transition';
const tabActive = 'bg-primary-500 text-white shadow-lg shadow-primary-500/30';
const tabInactive = 'text-slate-500 hover:text-primary-500';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false); // No longer needed
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    setError('');

    try {
      // Pass all three values to the context function
      const result = await login(email, password, role);

      if (result?.success) {
        navigate('/dashboard', { replace: true }); // Use replace to prevent going back to login
        return;
      } else {
        setError(result?.message || 'Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-100'>
      <div className="flex absolute items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg mt-3 ml-3 sm:mt-4 sm:ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5">
          </path>
        </svg>
      </div>
      <Ball />
{/* 
      <div className="bg-orange-50/90 blur-sm absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 ml-10  gap-6 ">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold text-slate-900 z-10">Transform <span className='text-orange-600'>Learning</span></h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold text-slate-900 z-10">with simple LMS</h1>
      </div> */}


      <div className="absolute top-1/4 sm:top-1/3 left-4 sm:left-1/4 transform -translate-x-1/2 sm:-translate-x-1/2 -translate-y-1/2 ml-4 sm:ml-10">

  {/* <div className="absolute inset-0 bg-orange-50/40 backdrop-blur-lg rounded-lg"></div> */}

  <div className="relative p-6 sm:p-8 lg:p-10">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold text-slate-900">
      Transform <span className="text-orange-600">Learning</span>
    </h1>
    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold text-slate-900">
      with simple LMS
    </h1>
  </div>
</div>

      
      <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center sm:justify-end px-4 py-6">
        
        <div className="rightSide w-full sm:w-96 lg:w-[28rem] xl:w-[32rem] max-w-xl rounded-3xl border border-orange-100 bg-white/95 px-6 py-8 sm:px-8 sm:py-12 shadow-[0_35px_70px_rgba(249,115,22,0.14)] z-50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-90">
            {/* ... (Your header, no changes) ... */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Welcome back</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Login to your account</h1>
              <p className="text-sm text-slate-500">Access your courses, assignments, and forums in a single place.</p>
            </div>

            {/* ... (Your role switcher, no changes) ... */}
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="flex gap-2 rounded-full border border-orange-100 bg-orange-50/70 p-1 shadow-inner">
                <button
                  type="button"
                  className={`${tabBase} ${role === 'student' ? tabActive : tabInactive}`}
                  onClick={() => setRole('student')}
                  aria-pressed={role === 'student'}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`${tabBase} ${role === 'teacher' ? tabActive : tabInactive}`}
                  onClick={() => setRole('teacher')}
                  aria-pressed={role === 'teacher'}
                >
                  Teacher
                </button>
              </div>
            </div>

            {/* ... (Your error display, no changes) ... */}
            {error && (
              <div className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
                {error}
              </div>
            )}

            {/* ... (Your input fields, no changes) ... */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {/* ... (Your 'Remember me' section, no changes) ... */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-orange-500 transition hover:text-orange-600"
                onClick={() => navigate('/forgotpassword')}
              >
                Forgot password?
              </button>
            </div>

            {/* ✅ Button now uses the 'loading' state from the context */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center bg-primary-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing In…' : 'Login'}
            </button>

            {/* ... (Your 'Create one' link, no changes) ... */}
            <div className="rounded-2xl bg-orange-50/90 p-4 text-center text-sm text-slate-600">
              Don’t have an account yet?{' '}
              <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
      
    </div>
    

  );
}