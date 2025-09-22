// src/components/GoogleLoginButton.jsx
import React from "react";

export default function GoogleLoginButton() {
  const backend = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const href = `${backend}/api/auth/google`;

  return (
    <a
      href={href}
      className="w-full flex items-center justify-center gap-3 px-5 py-2.5 
                 border border-gray-300 rounded-full bg-white 
                 text-gray-700 font-medium shadow-md 
                 hover:bg-gray-50 hover:shadow-lg 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                 transition-all duration-200"
    >
      <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
      <span>Continue with Google</span>
    </a>
  );
}
