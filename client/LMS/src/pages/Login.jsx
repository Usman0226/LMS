import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const highlights = [
  {
    title: 'Adaptive learning paths',
    description: 'Pick up exactly where you left off with AI-curated content suggestions.'
  },
  {
    title: 'Assignment pulse',
    description: 'Track due dates and feedback in one place with real-time notifications.'
  },
  {
    title: 'Collaborative classrooms',
    description: 'Embed discussions, peer reviews, and live sessions directly into every course.'
  }
];

const stats = [
  { label: 'Active learners', value: '12k+' },
  { label: 'Courses launched', value: '180+' },
  { label: 'Completion rate', value: '92%' }
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleCopy = {
    student: {
      title: 'Welcome back, learner',
      subtitle: 'Resume courses, submit assignments, and keep your goals in view.'
    },
    teacher: {
      title: 'Welcome back, mentor',
      subtitle: 'Manage cohorts, review progress, and publish new learning journeys.'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-800 via-primary-900 to-slate-900 p-10 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/70">
              <span className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-semibold">E</span>
              <span>EduLMS</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight">Bring every learning moment together.</h1>
              <p className="text-lg text-white/80">Synced schedules, progress dashboards, and guided cohorts help keep every student and teacher in lockstep.</p>
            </div>
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative h-full rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
          <div className="absolute inset-x-10 -top-12 hidden h-24 rounded-3xl bg-primary-500/10 blur-3xl lg:block" aria-hidden="true" />
          <div className="relative z-10">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Portal access</span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">Secure</span>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/70 p-1">
                {['student', 'teacher'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    className={`px-5 py-2 text-sm font-medium capitalize transition ${
                      role === option
                        ? 'rounded-full bg-slate-900 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    aria-pressed={role === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-white">{roleCopy[role].title}</h2>
              <p className="text-slate-400">{roleCopy[role].subtitle}</p>
            </div>

            {error && (
              <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 placeholder:text-slate-500"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <Link to="#" className="text-sm text-primary-400 hover:text-primary-300">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? 'Signing in…' : 'Sign in to workspace'}</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            <div className="mt-10 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] text-slate-500">
                  <span className="bg-slate-900 px-3">OR CONTINUE WITH</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-900">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0a12 12 0 00-3.795 23.383c.6.111.82-.26.82-.577 0-.285-.011-1.04-.017-2.042-3.338.726-4.042-1.61-4.042-1.61-.546-1.388-1.334-1.758-1.334-1.758-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.833 2.81 1.303 3.495.996.108-.775.419-1.303.762-1.602-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.469-2.381 1.236-3.22-.124-.304-.536-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 016.006 0c2.29-1.553 3.297-1.23 3.297-1.23.655 1.653.243 2.872.12 3.176.77.839 1.234 1.91 1.234 3.22 0 4.61-2.807 5.624-5.48 5.921.43.37.815 1.103.815 2.223 0 1.604-.015 2.896-.015 3.289 0 .32.218.694.825.576A12 12 0 0012 0z" />
                  </svg>
                  GitHub
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-900">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-4 text-center text-sm text-slate-300">
              <span className="mr-2">Need an account?</span>
              <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300">
                Create one now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
