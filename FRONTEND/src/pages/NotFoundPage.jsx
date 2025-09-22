// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Not Found</h1>
      <p className="text-gray-600 mb-6">We couldn't find that page.</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 text-white rounded">Go home</Link>
    </div>
  );
}
