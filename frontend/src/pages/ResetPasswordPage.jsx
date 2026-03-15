import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await apiClient.post(`/auth/reset-password/${token}`, { password });
      const { user, token: jwt } = res.data;
      login(user, jwt);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center px-6 py-12" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Reset Password | OurPetCare</title>
      </Helmet>

      <div className="w-full max-w-md fade-in-up">
        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔒</div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              Set New Password
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-3">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={6} className="input-field pr-12"
                  placeholder="Min 6 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                required minLength={6}
                className={`input-field ${confirm && password !== confirm ? "border-red-400" : ""}`}
                placeholder="Re-enter new password"
              />
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Reset Password"}
            </button>

            <p className="text-center text-sm text-gray-400">
              <Link to="/login" className="text-[#3d8c78] font-bold hover:text-[#2e6b5a]">Back to Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
