import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
