import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiClient } from "../api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center px-6 py-12" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Forgot Password | OurPetCare</title>
      </Helmet>

      <div className="w-full max-w-md fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-2 text-[#3d8c78] hover:text-[#2e6b5a] text-sm font-bold mb-8 transition-colors">
          ← Back to Sign In
        </Link>

        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔑</div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              Forgot Password?
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl text-sm font-semibold" style={{ background: "#eaf5f1", color: "#2e6b5a" }}>
                ✓ Reset link sent to <strong>{email}</strong>. Check your inbox (and spam folder).
              </div>
              <Link to="/login" className="block w-full btn-primary py-3 text-center mt-4">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-3">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required className="input-field" placeholder="Enter your registered email"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
