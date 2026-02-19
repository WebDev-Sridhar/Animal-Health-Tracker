import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function MainLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-gradient)" }}
    >
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path
                  fillRule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 019.816 3H9a1 1 0 00-.812.47l-1.018 1.623A10.005 10.005 0 001.664 10.59zM13.196 12.227a10.003 10.003 0 01-4.25-4.25l1.623-1.018A1 1 0 0012.53 5.812h1.623a10.004 10.004 0 01-7.592 7.592l-1.018-1.623a10.003 10.003 0 014.25-4.25l-.815-1.302a1 1 0 00-1.725.05l-1.3.206a10.002 10.002 0 01-3.32-3.32l.206-1.3a1 1 0 00-.05-1.725L3.47.812A1 1 0 002.66.47H1.037a10.004 10.004 0 017.592-7.592L9.247 3.88a1 1 0 001.725-.05l1.302.815a10.003 10.003 0 014.25 4.25l1.623-1.018A1 1 0 0019.53 7.47h1.623a10.004 10.004 0 01-7.592 7.592l-1.018-1.623a10.003 10.003 0 01-4.25-4.25l1.302-.815a1 1 0 00.05-1.725l-1.3-.206a10.002 10.002 0 01-3.32 3.32l-.206 1.3a1 1 0 00.05 1.725l1.302.815z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight">
                PetCare
              </h1>
              <p className="text-xs text-gray-600 -mt-1">Companion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-700 font-medium transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/report"
              className="text-gray-700 hover:text-purple-700 font-medium transition-colors relative group"
            >
              Report
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user?.role === "volunteer" && (
              <Link
                to="/volunteer"
                className="text-gray-700 hover:text-purple-700 font-medium transition-colors relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-purple-700 font-medium transition-colors relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-6 py-4 space-y-4">
              <Link
                to="/"
                className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/report"
                className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Report
              </Link>
              {user?.role === "volunteer" && (
                <Link
                  to="/volunteer"
                  className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-purple-700 font-medium transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Admin
                </Link>
              )}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full btn-secondary text-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center text-gray-700 hover:text-purple-700 font-medium transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full btn-primary text-sm text-center"
                      onClick={closeMobileMenu}
                    >
                      Join Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>
            © 2026 PetCare Companion. Caring for your furry family members, one
            paw at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
