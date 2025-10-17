import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tabBase = 'px-4 py-2 text-sm font-semibold rounded-lg transition';
const tabActive = 'bg-primary-500 text-white shadow-lg shadow-primary-500/30';
const tabInactive = 'text-slate-500 hover:text-primary-500';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const result = await login(email, password);
      if (result?.success) {
        navigate('/dashboard');
      } else {
        setError(result?.message || 'Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-orange-100 bg-white/95 px-8 py-12 shadow-[0_35px_70px_rgba(249,115,22,0.14)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Welcome back</span>
            <h1 className="text-3xl font-bold text-slate-900">Login to your account</h1>
            <p className="text-sm text-slate-500">Access your courses, assignments, and forums in a single place.</p>
          </div>

          <div className="mb-6 flex justify-center">
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

          {error && (
            <div className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
              {error}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing In…' : 'Login'}
          </button>

          <div className="rounded-2xl bg-orange-50/90 p-4 text-center text-sm text-slate-600">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
