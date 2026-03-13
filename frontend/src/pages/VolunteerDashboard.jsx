import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const statusBadge = (status) => {
  const map = { pending: "badge-amber", accepted: "badge-blue", resolved: "badge-green" };
  return map[status] || "badge-teal";
};

const conditionBadge = (condition) => {
  const map = {
    healthy: "badge-green", injured: "badge-orange", sick: "badge-red",
    aggressive: "badge-red", "vaccination-needed": "badge-amber",
    critical: "badge-red", "for-adoption": "badge-teal",
  };
  return map[condition] || "badge-teal";
};

export default function VolunteerDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const url = zone ? `/reports?zone=${encodeURIComponent(zone)}` : "/reports";
        const res = await apiClient.get(url);
        setReports(res.data || []);
      } catch {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [zone]);

  const acceptReport = async (id) => {
    try {
      const res = await apiClient.patch(`/reports/${id}/accept`);
      setReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) { alert(err.message); }
  };

  const resolveReport = async (id) => {
    try {
      await apiClient.patch(`/reports/${id}/resolve`);
      setReports((p) => p.map((r) => (r._id === id ? { ...r, status: "resolved" } : r)));
    } catch (err) { alert(err.message); }
  };

  const unassignReport = async (id) => {
    try {
      const res = await apiClient.patch(`/reports/${id}/unassign`);
      setReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) { alert(err.message); }
  };

  const pending = reports.filter((r) => r.status === "pending");
  const accepted = reports.filter((r) => r.status === "accepted");
  const resolved = reports.filter((r) => r.status === "resolved");

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Volunteer Dashboard | OurPetCare</title>
        <meta name="description" content="Manage animal welfare reports and contribute to saving animals across Tamil Nadu." />
      </Helmet>

      {/* ─── Header ─── */}
      <div className="py-10 px-6" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "rgba(255,255,255,0.2)" }}>🤝</div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
                Volunteer Dashboard
              </h1>
              <p className="text-teal-100">Welcome back, {user?.name?.split(" ")[0]} — {user?.zone || "All zones"}</p>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Pending", value: pending.length, emoji: "⏳", color: "bg-amber-400" },
              { label: "In Progress", value: accepted.length, emoji: "🚑", color: "bg-blue-400" },
              { label: "Resolved", value: resolved.length, emoji: "✅", color: "bg-green-400" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl text-white text-center"
                style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "'Fredoka', cursive" }}>{s.value}</div>
                <div className="text-xs text-teal-100 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Zone Filter */}
        <div className="card p-4 mb-6 flex items-center gap-4 flex-wrap">
          <label className="text-sm font-extrabold text-gray-600">🔍 Filter by zone:</label>
          <input type="text" value={zone} onChange={(e) => setZone(e.target.value)}
            placeholder="Type zone name..." className="input-field max-w-xs py-2.5 text-sm" />
          {zone && (
            <button onClick={() => setZone("")} className="text-sm font-bold text-teal-600 hover:text-teal-700 underline underline-offset-2">
              ✕ Clear
            </button>
          )}
          <span className="ml-auto text-sm text-gray-500 font-semibold">{reports.length} total reports</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-600 font-semibold">Loading reports...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-gray-700" style={{ fontFamily: "'Fredoka', cursive" }}>No reports found</h3>
            <p className="text-gray-500 mt-2 text-sm">{zone ? "Try a different zone name." : "No reports submitted yet."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex flex-wrap gap-4">
                  {/* Photo */}
                  {r.photo && (
                    <a href={r.photo} download={`report-${r._id}.jpg`} className="flex-shrink-0">
                      <img src={r.photo} alt="Animal"
                        className="w-36 h-36 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition hover:scale-105 shadow-md" />
                    </a>
                  )}

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-extrabold text-gray-800 capitalize" style={{ fontFamily: "'Fredoka', cursive" }}>
                        {r.animal?.species || "Unknown"} — {r.zone || "No zone"}
                      </h3>
                      <span className={`badge ${conditionBadge(r.condition)} text-xs`}>{r.condition}</span>
                      <span className={`badge ${statusBadge(r.status)} text-xs`}>{r.status}</span>
                    </div>
                    {r.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{r.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      📅 {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Reporter */}
                  {r.reportedBy && (
                    <div className="text-sm border-l border-gray-100 pl-4 min-w-[160px]">
                      <p className="font-extrabold text-gray-600 text-xs uppercase tracking-wide mb-2">Reporter</p>
                      <p className="font-bold text-gray-800">{r.reportedBy.name}</p>
                      <p className="text-gray-500 text-xs">{r.reportedBy.email}</p>
                      {r.reportedBy.phone && (
                        <a href={`tel:${r.reportedBy.phone}`}
                          className="inline-flex items-center gap-1 mt-1 text-teal-600 hover:text-teal-700 text-xs font-bold">
                          📞 {r.reportedBy.phone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center min-w-[120px]">
                    {r.status === "pending" && (
                      <button onClick={() => acceptReport(r._id)}
                        className="px-4 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105 shadow-sm"
                        style={{ background: "var(--primary)" }}>
                        ✅ Accept
                      </button>
                    )}
                    {r.status === "accepted" && (
                      r.acceptedBy?._id === user.id ? (
                        <>
                          <button onClick={() => resolveReport(r._id)}
                            className="px-4 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105 shadow-sm"
                            style={{ background: "#1e3a5f" }}>
                            🏁 Resolve
                          </button>
                          <button onClick={() => unassignReport(r._id)}
                            className="px-4 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105 shadow-sm"
                            style={{ background: "#d97706" }}>
                            ↩️ Give Back
                          </button>
                        </>
                      ) : (
                        <span className="px-4 py-2 rounded-full text-sm font-bold text-center bg-gray-100 text-gray-500">
                          In Progress
                        </span>
                      )
                    )}
                    {r.status === "resolved" && (
                      <span className="px-4 py-2 rounded-full text-sm font-bold text-center badge-green">
                        ✅ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
