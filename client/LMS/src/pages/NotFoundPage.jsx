import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="text-primary-600 hover:underline">Go Home</Link>
    </div>
  );
}
