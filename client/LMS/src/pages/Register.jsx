import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.terms) {
      setError('You must agree to the Terms and Privacy Policy');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      };

      const result = await register(payload);
      if (result?.success) {
        navigate(role === 'teacher' ? '/dashboard' : '/courses');
      } else {
        setError(result?.message || 'Failed to create an account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabBase = 'px-4 py-2 text-sm font-medium rounded-md transition';
  const tabActive = 'bg-slate-700 text-white shadow';
  const tabInactive = 'text-gray-400 hover:text-white';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-white bg-slate-900 border border-slate-800 shadow-lg rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 p-1 rounded-full flex gap-2 border border-slate-700">
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

        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        <p className="text-center text-slate-300 mt-1">Join to start your learning journey</p>

        {error && (
          <div className="mt-6 mb-2 p-4 bg-red-900/40 text-red-200 rounded-lg text-sm border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-200 mb-1.5">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-200 mb-1.5">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1.5">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-1.5">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-slate-300 text-sm">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-1 accent-indigo-600"
              required
            />
            <span>
              I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 transition-colors rounded-lg py-3 text-white font-semibold w-full disabled:opacity-60"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.16 20 14.417 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="w-5 h-5" aria-hidden="true" fill="#4285F4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
            <span className="mr-1 text-slate-200">Already have an account?</span>
            <Link to="/login" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
