// src/pages/NotFoundPage.jsx

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
        404 — Not Found
      </h1>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
        We couldn't find that page.
      </p>
      <Link
        to="/"
        className="inline-block px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded text-sm sm:text-base hover:bg-indigo-700 transition"
      >
        Go home
      </Link>
    </div>
  );
}
