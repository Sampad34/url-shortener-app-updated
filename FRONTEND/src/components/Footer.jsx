// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="border-t mt-12 bg-white">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-center sm:text-left">
        <div>© {new Date().getFullYear()} Shortify</div>
        <div>Built with React • Vite • Tailwind</div>
      </div>
    </footer>
  );
}
