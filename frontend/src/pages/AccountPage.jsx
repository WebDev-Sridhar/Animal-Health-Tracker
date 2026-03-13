import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

const CONDITION_OPTIONS = [
  { value: "healthy", label: "Healthy" },
  { value: "injured", label: "Injured" },
  { value: "sick", label: "Sick" },
  { value: "aggressive", label: "Aggressive" },
  { value: "vaccination-needed", label: "Vaccination Needed" },
  { value: "critical", label: "Critical" },
  { value: "for-adoption", label: "For Adoption" },
];

const conditionBadge = (condition) => {
  const map = {
    healthy: "badge-green", injured: "badge-orange", sick: "badge-red",
    aggressive: "badge-red", "vaccination-needed": "badge-amber",
    critical: "badge-red", "for-adoption": "badge-teal",
  };
  return map[condition] || "badge-teal";
};

const statusBadge = (status) => {
  const map = { pending: "badge-amber", accepted: "badge-blue", resolved: "badge-green" };
  return map[status] || "badge-teal";
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { user: authUser, login, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [editingUser, setEditingUser] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [formData, setFormData] = useState({});
  const [reportFormData, setReportFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({ name: authUser.name, phone: authUser.phone || "", zone: authUser.zone || "" });
      fetchReports();
    }
  }, [authUser]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const reportRes = await apiClient.get("/reports?mine=true");
      setReports(reportRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleEditUser = () => {
    setEditingUser(true);
    setFormData({ name: user.name, phone: user.phone || "", zone: user.zone || "" });
  };

  const handleSaveUser = async () => {
    setLoading(true);
    try {
      const res = await apiClient.patch("/auth/profile", formData);
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      login(updatedUser, localStorage.getItem("token"));
      setEditingUser(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setEditingReportId(report._id);
    setReportFormData({ condition: report.condition, zone: report.zone, description: report.description || "" });
  };

  const handleSaveReport = async (reportId) => {
    setLoading(true);
    try {
      await apiClient.patch(`/reports/${reportId}`, reportFormData);
      setReports(reports.map((r) => r._id === reportId ? { ...r, ...reportFormData } : r));
      setEditingReportId(null);
      alert("Report updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await apiClient.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--bg-gradient)" }}>
        <div className="card p-10 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            My Account
          </h1>
          <p className="text-gray-500 mb-6">Please sign in to view your account and reports.</p>
          <button onClick={() => navigate("/login")} className="w-full btn-primary mb-3">Sign In</button>
          <p className="text-gray-500 text-sm">
            No account?{" "}
            <button onClick={() => navigate("/register")} className="text-teal-600 hover:text-teal-700 font-extrabold">
              Register free →
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-semibold">Loading your account...</p>
        </div>
      </div>
    );
  }

  const roleColors = { admin: "badge-red", volunteer: "badge-teal", public: "badge-blue" };

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>My Account | OurPetCare</title>
        <meta name="description" content="Manage your OurPetCare account, view your reports, and track your contribution to animal welfare." />
      </Helmet>

      {/* ─── Header ─── */}
      <div className="relative py-10 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-teal-700 shadow-lg"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: "0.75rem" }}>
                {user.email}
              </span>
              <span className={`badge ${roleColors[user.role] || "badge-teal"} capitalize`}>{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* ─── Profile Card ─── */}
        <div className="card p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              Profile Details
            </h2>
            {!editingUser && (
              <button onClick={handleEditUser}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {editingUser ? (
            <div className="space-y-4">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Zone", key: "zone", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-extrabold text-gray-700 mb-2">{label}</label>
                  <input type={type} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="input-field" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveUser} disabled={loading}
                  className="flex-1 btn-primary py-3 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setEditingUser(false)} className="flex-1 btn-secondary py-3">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { label: "Full Name", value: user.name, emoji: "👤" },
                { label: "Email", value: user.email, emoji: "📧" },
                { label: "Phone", value: user.phone || "Not added", emoji: "📞" },
                { label: "Role", value: user.role, emoji: "🎭", capitalize: true },
                { label: "Zone", value: user.zone || "Not added", emoji: "📍" },
                { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString(), emoji: "📅" },
              ].map(({ label, value, emoji, capitalize }) => (
                <div key={label} className="p-4 rounded-2xl bg-gray-50">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{emoji} {label}</p>
                  <p className={`font-bold text-gray-800 ${capitalize ? "capitalize" : ""}`}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── My Reports ─── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              My Reports ({reports.length})
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {loadingReports ? (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">Loading reports...</p>
                </div>
              </div>
            ) : reports.length === 0 ? (
              <div className="col-span-full card p-10 text-center">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>No reports yet</h3>
                <p className="text-gray-500 mb-5 text-sm">Start by reporting an animal to help them get the care they need.</p>
                <button onClick={() => navigate("/report")} className="btn-primary text-sm py-2.5 px-6">
                  Create Your First Report
                </button>
              </div>
            ) : (
              reports.map((r) => (
                <div key={r._id} className="card overflow-hidden">
                  {r.photo && (
                    <img src={r.photo} alt="animal" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-5">
                    {editingReportId === r._id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wide">Condition</label>
                          <select value={reportFormData.condition}
                            onChange={(e) => setReportFormData({ ...reportFormData, condition: e.target.value })}
                            className="input-field mt-1.5 text-sm">
                            <option value="">Select Condition</option>
                            {CONDITION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wide">Zone</label>
                          <input type="text" value={reportFormData.zone}
                            onChange={(e) => setReportFormData({ ...reportFormData, zone: e.target.value })}
                            className="input-field mt-1.5 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wide">Description</label>
                          <textarea value={reportFormData.description}
                            onChange={(e) => setReportFormData({ ...reportFormData, description: e.target.value })}
                            className="input-field mt-1.5 text-sm resize-none" rows="2" />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => handleSaveReport(r._id)} disabled={loading}
                            className="flex-1 btn-primary text-sm py-2.5 disabled:opacity-50">
                            {loading ? "Saving..." : "Save"}
                          </button>
                          <button onClick={() => setEditingReportId(null)} className="flex-1 btn-secondary text-sm py-2.5">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-extrabold text-gray-800 capitalize" style={{ fontFamily: "'Fredoka', cursive" }}>
                              {r.animal?.species?.toUpperCase() || "Animal"}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">📍 {r.zone}</p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <span className={`badge ${conditionBadge(r.condition)} text-xs`}>{r.condition}</span>
                            <span className={`badge ${statusBadge(r.status)} text-xs`}>{r.status}</span>
                          </div>
                        </div>

                        {r.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.description}</p>
                        )}

                        <p className="text-xs text-gray-400 mb-4">
                          Posted: {new Date(r.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2">
                          {r.status === "pending" && (
                            <button onClick={() => handleEditReport(r)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">
                              ✏️ Edit
                            </button>
                          )}
                          <button onClick={() => deleteReport(r._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
                            🗑️ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
