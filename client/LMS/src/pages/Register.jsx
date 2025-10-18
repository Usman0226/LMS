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

  const tabBase = 'px-4 py-2 text-sm font-semibold rounded-full transition';
  const tabActive = 'bg-primary-500 text-white shadow-lg shadow-primary-500/30';
  const tabInactive = 'text-slate-500 hover:text-primary-500';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-orange-100 bg-white/95 px-8 py-12 shadow-[0_35px_80px_rgba(249,115,22,0.14)]">
       

        <div className="space-y-2 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Join our community</span>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500">
            Set up your profile to start learning, tracking progress, and collaborating with your cohort.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}
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
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-slate-700">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="John"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
              required
            />
            <span>
              I agree to the{' '}
              <a href="#" className="font-semibold text-orange-500 hover:text-orange-600">Terms of Service</a> and{' '}
              <a href="#" className="font-semibold text-orange-500 hover:text-orange-600">Privacy Policy</a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 rounded-2xl bg-orange-50/90 p-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
