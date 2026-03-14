import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useState } from "react";
import Footer from "../components/Footer";

export default function MainLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalUnread } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-gradient)" }}>
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm" style={{ borderBottom: "1px solid #e8d9cc" }}>
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobileMenu}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #84a59d 0%, #6b8c85 100%)" }}>
              <span className="text-xl">🐾</span>
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight"
                style={{ fontFamily: "'Fredoka', cursive", color: "var(--primary-dark)" }}>
                OurPetCare
              </span>
              <span className="block text-xs font-semibold -mt-0.5" style={{ color: "#84a59d" }}>
                Animal Rescue Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/adoption", label: "Adopt" },
              { to: "/petcaretips", label: "Tips" },
              { to: "/faq", label: "FAQ" },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="relative text-sm font-bold px-3 py-2 rounded-xl transition-all duration-200"
                style={{
                  color: isActive(to) ? "var(--primary-dark)" : "#5c6b6a",
                  background: isActive(to) ? "#f0f5f4" : "transparent",
                  fontWeight: isActive(to) ? 800 : 700,
                }}>
                {label}
                {/* {isActive(to) && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full" style={{ background: "var(--primary)" }} />
                )} */}
              </Link>
            ))}
            {user?.role === "volunteer" && (
              <Link to="/volunteer" className="relative text-sm font-bold px-3 py-2 rounded-xl transition-all"
                style={{ color: isActive("/volunteer") ? "var(--primary-dark)" : "#5c6b6a", background: isActive("/volunteer") ? "#f0f5f4" : "transparent" }}>
                Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className="relative text-sm font-bold px-3 py-2 rounded-xl transition-all"
                style={{ color: isActive("/admin") ? "var(--primary-dark)" : "#5c6b6a", background: isActive("/admin") ? "#f0f5f4" : "transparent" }}>
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/report" className="btn-orange text-sm py-2 px-4">Report</Link>
            {isAuthenticated && (
              <Link to="/account" style={{ position: 'relative', display: 'inline-flex' }}>
                <button
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: '#5c6b6a', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18 }}
                  aria-label="Chat"
                >
                  💬
                </button>
                {totalUnread > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2,
                    background: '#ef4444', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}>
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/account"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
                  style={{ color: "#5c6b6a" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold uppercase"
                    style={{ background: "#d4e4e1", color: "#6b8c85" }}>
                    {user?.name?.[0] || "U"}
                  </div>
                  {user?.name?.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">Logout</button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Join Us</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-xl transition-colors" aria-label="Toggle mobile menu">
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 rounded-full bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 rounded-full bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 rounded-full bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-md" style={{ borderTop: "1px solid #e8d9cc" }}>
            <div className="px-5 py-4 space-y-1">
              {[
                { to: "/", label: "Home" },
                { to: "/adoption", label: "Adopt a Pet" },
                { to: "/report", label: "Report Animal" },
                { to: "/petcaretips", label: "Pet Care Tips" },
                { to: "/faq", label: "FAQ" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} onClick={closeMobileMenu}
                  className="block px-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={isActive(to) ? { background: "#f0f5f4", color: "var(--primary-dark)", fontWeight: 800 } : { color: "#5c6b6a", fontWeight: 700 }}>
                  {label}
                </Link>
              ))}
              {user?.role === "volunteer" && (
                <Link to="/volunteer" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-xl text-sm font-bold" style={{ color: "#5c6b6a" }}>
                  Dashboard
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin" onClick={closeMobileMenu} className="block px-4 py-2.5 rounded-xl text-sm font-bold" style={{ color: "#5c6b6a" }}>
                  Admin
                </Link>
              )}
              <div className="pt-3 space-y-2" style={{ borderTop: "1px solid #e8d9cc" }}>
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ color: "#5c6b6a" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold uppercase"
                        style={{ background: "#d4e4e1", color: "#6b8c85" }}>
                        {user?.name?.[0] || "U"}
                      </div>
                      My Account
                    </Link>
                    <Link to="/account" onClick={closeMobileMenu}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold" style={{ color: "#5c6b6a" }}>
                      <span>💬 Messages</span>
                      {totalUnread > 0 && (
                        <span style={{
                          background: '#ef4444', color: '#fff',
                          borderRadius: 10, padding: '1px 7px',
                          fontSize: 11, fontWeight: 800,
                        }}>
                          {totalUnread > 9 ? '9+' : totalUnread}
                        </span>
                      )}
                    </Link>
                    <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="w-full btn-secondary text-sm py-2.5">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMobileMenu} className="block w-full text-center btn-secondary text-sm py-2.5">Login</Link>
                    <Link to="/register" onClick={closeMobileMenu} className="block w-full text-center btn-primary text-sm py-2.5">Join Us</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
