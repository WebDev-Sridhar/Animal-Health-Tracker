import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "public",
    zone: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register(form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-[92vh] flex">
      <Helmet>
        <title>Create Account | OurPetCare</title>
        <meta name="description" content="Register for OurPetCare to report animal welfare concerns and help protect animals in Tamil Nadu." />
      </Helmet>

      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md fade-in-up">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-[#3d8c78] hover:text-[#2e6b5a] text-sm font-bold mb-6 transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              Join OurPetCare 🐾
            </h1>
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#3d8c78] hover:text-[#2e6b5a] font-extrabold transition-colors">
                Sign in →
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">Full Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                className="input-field" placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                className="input-field" placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={form.password} onChange={handleChange}
                  required minLength={6}
                  className="input-field pr-12"
                  placeholder="Create a password (min 6 characters)"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "public", label: "🌍 Public User", desc: "Report & adopt" },
                  { value: "volunteer", label: "🤝 Volunteer", desc: "Rescue animals" },
                ].map((r) => (
                  <label key={r.value}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      form.role === r.value ? "border-[#3d8c78] bg-[#eaf5f1]" : "border-gray-200 hover:border-[#d0ece5]"
                    }`}>
                    <input type="radio" name="role" value={r.value}
                      checked={form.role === r.value} onChange={handleChange} className="sr-only" />
                    <div className="font-bold text-sm text-gray-800">{r.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">Zone / Area</label>
              <input
                type="text" name="zone" value={form.zone} onChange={handleChange}
                className="input-field" placeholder="Your city or area (e.g. Chennai, Coimbatore)"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel" name="phone" value={form.phone} onChange={handleChange}
                className="input-field" placeholder="Your phone number"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create My Account 🐾"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5">
            By joining, you agree to help protect animals and follow responsible reporting guidelines.
          </p>
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 60%, #4da090 100%)" }}>
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
          alt="Two dogs"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25"
        />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <div className="text-6xl mb-6 float-anim">🐶</div>
          <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Be a Hero for Animals
          </h2>
          <p className="leading-relaxed max-w-xs" style={{ color: "#f7ede2" }}>
            Your account gives you the power to report injuries, adopt rescued pets, and join a caring community.
          </p>
          <div className="mt-8 space-y-3 w-full max-w-xs">
            {[
              "🐾 Report injured animals instantly",
              "🏡 Browse pets available for adoption",
              "📊 Track your rescue impact",
              "🤝 Connect with local volunteers",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 rounded-xl text-sm text-left"
                style={{ background: "rgba(255,255,255,0.15)" }}>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
