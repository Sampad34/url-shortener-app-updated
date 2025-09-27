import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-gray-500 text-xs sm:text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <GoogleLoginButton />

        <p className="mt-4 text-center text-xs sm:text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
