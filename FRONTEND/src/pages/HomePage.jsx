// src/pages/HomePage.jsx

import UrlForm from '../components/UrlForm.jsx';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold mb-3">Shortify — fast, simple URL shortener</h1>
        <p className="text-gray-600 mb-6">Paste a link and get a short, shareable URL.</p>

        <div className="mb-8">
          <UrlForm />
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-left">
          <h3 className="font-semibold mb-2">Why Shortify?</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Private dashboard for your links.</li>
            <li>Simple API and lightweight UI.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
