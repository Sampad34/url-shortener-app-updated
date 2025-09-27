// src/pages/HomePage.jsx

import UrlForm from "../components/UrlForm.jsx";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          Shortify — fast, simple URL shortener
        </h1>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          Paste a link and get a short, shareable URL.
        </p>

        <div className="mb-6 sm:mb-8">
          <UrlForm />
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-left">
          <h3 className="font-semibold mb-2 text-base sm:text-lg">Why Shortify?</h3>
          <ul className="text-xs sm:text-sm md:text-base text-gray-600 list-disc list-inside space-y-1">
            <li>Private dashboard for your links.</li>
            <li>Simple API and lightweight UI.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
