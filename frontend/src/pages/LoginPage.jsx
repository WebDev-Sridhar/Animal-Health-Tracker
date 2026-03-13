import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      login(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex">
      <Helmet>
        <title>Sign In | OurPetCare</title>
        <meta name="description" content="Sign in to your OurPetCare account to track animal health and contribute to animal welfare." />
      </Helmet>

      {/* Left: Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 60%, #4da090 100%)" }}>
        <img
          src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=900&q=80"
          alt="Person with dog"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <div className="text-7xl mb-6 float-anim">🐾</div>
          <h2 className="text-4xl font-bold mb-4 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Welcome Back to OurPetCare
          </h2>
          <p className="text-lg leading-relaxed max-w-sm" style={{ color: "#f7ede2" }}>
            Every login brings you one step closer to helping animals in need. Your community is waiting.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { icon: "🐕", label: "2,400+ Rescued" },
              { icon: "🏡", label: "1,200+ Adopted" },
              { icon: "🤝", label: "800+ Volunteers" },
              { icon: "📋", label: "5,800+ Reports" },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs font-bold" style={{ color: "#f7ede2" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md fade-in-up">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[#3d8c78] hover:text-[#2e6b5a] text-sm font-bold mb-6 transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              Sign In
            </h1>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#3d8c78] hover:text-[#2e6b5a] font-extrabold transition-colors">
                Join our community →
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In to OurPetCare"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="paw-divider mt-8">
            <span className="text-gray-400 text-sm font-semibold px-3 text-center">
              🐾 Every account helps animals
            </span>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 rounded-2xl text-sm text-center" style={{ background: "#eaf5f1" }}>
            <p className="text-[#2e6b5a] font-semibold">
              New to OurPetCare?{" "}
              <Link to="/register" className="text-[#3d8c78] hover:text-[#1e3d30] font-extrabold underline underline-offset-2">
                Create a free account
              </Link>{" "}
              and start helping animals today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
