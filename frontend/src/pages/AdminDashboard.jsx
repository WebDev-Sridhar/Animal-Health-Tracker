import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { apiClient } from "../api/client";
import { analyticsApi } from "../api/analytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CHART_COLORS = {
  healthy: "#22c55e", sick: "#8b5cf6", critical: "#ef4444",
  injured: "#f59e0b", "vaccination-needed": "#3b82f6",
  aggressive: "#f97316", "for-adoption": "#10b981",
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recalcLoading, setRecalcLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await analyticsApi.getAnalytics();
      setAnalytics(res.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load analytics");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const recalculateRisk = async () => {
    setRecalcLoading(true);
    try {
      await apiClient.post("/risk/recalculate");
      await fetchAnalytics();
    } catch (err) {
      setError(err.message || "Recalculation failed");
    } finally {
      setRecalcLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-gradient)" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#d0ece5", borderTopColor: "#3d8c78" }} />
          <p className="text-gray-600 font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-800 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const hb = analytics?.healthBreakdown ?? {};
  const atRisk = (hb.sick ?? 0) + (hb.critical ?? 0) + (hb.injured ?? 0);

  const statCards = [
    { label: "Total Animals", value: analytics?.totalAnimals ?? 0, emoji: "🐾", color: "from-green-500 to-green-600" },
    { label: "At Risk", value: atRisk, emoji: "🤒", color: "from-red-400 to-red-500" },
    { label: "Vaccinated", value: analytics?.vaccinatedAnimals ?? 0, emoji: "💉", color: "from-green-400 to-green-500" },
    { label: "Vaccination Needed", value: hb["vaccination-needed"] ?? 0, emoji: "⚠️", color: "from-cyan-400 to-cyan-500" },
    { label: "For Adoption", value: hb["for-adoption"] ?? 0, emoji: "🏡", color: "from-blue-400 to-blue-500" },
    { label: "Reports This Week", value: analytics?.reportsThisWeek ?? 0, emoji: "📋", color: "from-violet-400 to-violet-500" },
  ];

  const healthData = {
    labels: Object.keys(analytics?.healthBreakdown ?? {}).map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [{
      data: Object.values(analytics?.healthBreakdown ?? {}),
      backgroundColor: Object.keys(analytics?.healthBreakdown ?? {}).map((k) => CHART_COLORS[k] || "#6b7280"),
      borderWidth: 0,
    }],
  };

  const zoneData = {
    labels: (analytics?.zones ?? []).map((z) => z.name),
    datasets: [{
      label: "Risk Score",
      data: (analytics?.zones ?? []).map((z) => z.riskScore),
      backgroundColor: (analytics?.zones ?? []).map((z) =>
        z.riskScore >= 80 ? "#ef4444" : z.riskScore >= 50 ? "#f59e0b" : "#22c55e"
      ),
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { font: { family: "Nunito", size: 12 } } } },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Admin Dashboard | OurPetCare</title>
        <meta name="description" content="Monitor animal health statistics and reports across all of Tamil Nadu." />
      </Helmet>

      {/* ─── Header ─── */}
      <div className="py-10 px-6" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "rgba(255,255,255,0.2)" }}>⚙️</div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
                Admin Analytics
              </h1>
              <p className="text-sm" style={{ color: "#f7ede2" }}>Tamil Nadu animal health overview</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchAnalytics}
              className="px-4 py-2.5 rounded-full text-sm font-extrabold bg-white/20 text-white hover:bg-white/30 transition-all">
              🔄 Refresh
            </button>
            <button onClick={recalculateRisk} disabled={recalcLoading}
              className="px-4 py-2.5 rounded-full text-sm font-extrabold bg-white transition-all disabled:opacity-60"
              style={{ color: "#2e6b5a" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#eaf5f1"}
              onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
              {recalcLoading ? "Recalculating..." : "⚡ Recalc Zone Risk"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm flex items-center gap-2">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 text-2xl shadow-md`}>
                {stat.emoji}
              </div>
              <p className="text-3xl font-extrabold text-gray-800 mb-1" style={{ fontFamily: "'Fredoka', cursive" }}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              🏥 Health Status Breakdown
            </h2>
            <div className="h-64">
              {Object.keys(analytics?.healthBreakdown ?? {}).length > 0 ? (
                <Doughnut data={healthData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-semibold">
                  No animal data yet
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              📍 Zone Risk Scores
            </h2>
            <div className="h-64">
              {(analytics?.zones ?? []).length > 0 ? (
                <Bar data={zoneData} options={barOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-gray-400 font-semibold">No zone data available.</p>
                    <button onClick={recalculateRisk} className="mt-3 btn-primary text-sm py-2 px-5">
                      Run Recalculation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zone Table */}
        {(analytics?.zones ?? []).length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                📊 Zone Risk Details
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-extrabold text-gray-600 uppercase tracking-wider text-xs">Zone</th>
                    <th className="text-left px-6 py-3 font-extrabold text-gray-600 uppercase tracking-wider text-xs">Risk Score</th>
                    <th className="text-left px-6 py-3 font-extrabold text-gray-600 uppercase tracking-wider text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.zones.map((z, i) => (
                    <tr key={z.name} className={`border-b border-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(234,245,241,0.4)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}>
                      <td className="px-6 py-3.5 font-bold text-gray-800">{z.name}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-24 bg-gray-100 rounded-full h-2">
                            <div className="h-2 rounded-full transition-all"
                              style={{
                                width: `${z.riskScore}%`,
                                background: z.riskScore >= 80 ? "#ef4444" : z.riskScore >= 50 ? "#f59e0b" : "#22c55e"
                              }} />
                          </div>
                          <span className="font-extrabold text-gray-700">{z.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`badge text-xs ${z.riskScore >= 80 ? "badge-red" : z.riskScore >= 50 ? "badge-amber" : "badge-green"}`}>
                          {z.riskScore >= 80 ? "🔴 High Risk" : z.riskScore >= 50 ? "🟡 Medium" : "🟢 Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
