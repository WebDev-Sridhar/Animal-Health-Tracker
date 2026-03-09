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
    // Use user from auth context
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.name,
        phone: authUser.phone || "",
        zone: authUser.zone || "",
      });
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
    setFormData({
      name: user.name,
      phone: user.phone || "",
      zone: user.zone || "",
    });
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
    setReportFormData({
      condition: report.condition,
      zone: report.zone,
      description: report.description || "",
    });
  };

  const handleSaveReport = async (reportId) => {
    setLoading(true);
    try {
      await apiClient.patch(`/reports/${reportId}`, reportFormData);
      setReports(
        reports.map((r) =>
          r._id === reportId ? { ...r, ...reportFormData } : r,
        ),
      );
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              My Account
            </h1>
            <p className="text-slate-600">
              Please sign in to view your account details and reports
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full btn-primary"
          >
            Sign In
          </button>
          <p className="text-slate-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Helmet>
        <title>My Account | OurPetCare</title>
        <meta
          name="description"
          content="Manage your OurPetCare account, view your reports, and track your contribution to animal welfare."
        />
      </Helmet>
      {/* Account Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-slate-800">My Account</h1>
          {!editingUser && (
            <button
              onClick={handleEditUser}
              className="text-blue-600 hover:text-blue-700 p-2"
              title="Edit profile"
            >
              ✏️
            </button>
          )}
        </div>

        {editingUser ? (
          <div className="space-y-4">
            <div>
              <label className="text-slate-600 font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-slate-600 font-medium">Zone</label>
              <input
                type="text"
                value={formData.zone}
                onChange={(e) =>
                  setFormData({ ...formData, zone: e.target.value })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveUser}
                disabled={loading}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingUser(false)}
                className="flex-1 bg-slate-400 text-white rounded-lg py-2 hover:bg-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-slate-400">Phone</p>
              <p className="font-medium">{user.phone || "Not added"}</p>
            </div>

            <div>
              <p className="text-slate-400">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>

            <div>
              <p className="text-slate-400">Zone</p>
              <p className="font-medium">{user.zone || "Not added"}</p>
            </div>

            <div>
              <p className="text-slate-400">Joined</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Reports */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          My Reports
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {loadingReports ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-600 text-lg">Loading...</p>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-slate-600 text-lg font-medium">
                  No reports yet
                </p>
                <p className="text-slate-500 mt-2">
                  Start by creating a report to help animals in need
                </p>
              </div>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
              >
                {r.photo && (
                  <img
                    src={r.photo}
                    alt="animal"
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4 space-y-2">
                  {editingReportId === r._id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-600 text-sm font-medium">
                          Condition
                        </label>
                        <select
                          value={reportFormData.condition}
                          onChange={(e) =>
                            setReportFormData({
                              ...reportFormData,
                              condition: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm"
                        >
                          <option value="">Select Condition</option>
                          {CONDITION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-600 text-sm font-medium">
                          Zone
                        </label>
                        <input
                          type="text"
                          value={reportFormData.zone}
                          onChange={(e) =>
                            setReportFormData({
                              ...reportFormData,
                              zone: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 text-sm font-medium">
                          Description
                        </label>
                        <textarea
                          value={reportFormData.description}
                          onChange={(e) =>
                            setReportFormData({
                              ...reportFormData,
                              description: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 text-sm"
                          rows="2"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleSaveReport(r._id)}
                          disabled={loading}
                          className="flex-1 bg-green-600 text-white text-sm rounded-lg py-2 hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingReportId(null)}
                          className="flex-1 bg-slate-400 text-white text-sm rounded-lg py-2 hover:bg-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-slate-800">
                        {r.animal?.species?.toUpperCase()}
                      </h3>

                      <p className="text-sm text-slate-600">
                        Condition: {r.condition}
                      </p>

                      <p className="text-sm text-slate-500">Zone: {r.zone}</p>

                      {r.description && (
                        <p className="text-sm text-slate-600">
                          {r.description}
                        </p>
                      )}

                      <p className="text-xs text-slate-400">
                        Posted: {new Date(r.createdAt).toLocaleDateString()}
                      </p>

                      <span className="inline-block text-xs px-2 py-1 rounded bg-slate-100">
                        {r.status}
                      </span>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-3">
                        {r.status === "pending" && (
                          <button
                            onClick={() => handleEditReport(r)}
                            className="flex-1 bg-blue-600 text-white text-sm rounded-lg py-2 hover:bg-blue-700"
                          >
                            ✏️ Edit
                          </button>
                        )}

                        <button
                          onClick={() => deleteReport(r._id)}
                          className="flex-1 bg-red-600 text-white text-sm rounded-lg py-2 hover:bg-red-700"
                        >
                          Delete
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
  );
}
