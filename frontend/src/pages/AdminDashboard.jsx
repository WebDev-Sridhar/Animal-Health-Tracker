import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, PointElement, LineElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { apiClient } from "../api/client";
import { analyticsApi } from "../api/analytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const TIMEFRAMES = [
  { key: "week",    label: "This Week" },
  { key: "month",   label: "This Month" },
  { key: "3months", label: "3 Months" },
  { key: "year",    label: "This Year" },
  { key: "all",     label: "All Time" },
];

const pct = (resolved, submitted) =>
  submitted > 0 ? Math.round((resolved / submitted) * 100) : 0;

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("all");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getAnalytics(timeframe);
      setAnalytics(res.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load analytics");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

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

  const summary = analytics?.summary ?? {};
  const cats = analytics?.categories ?? {};
  const trend = analytics?.trend ?? [];
  const zones = analytics?.zones ?? [];

  // Summary totals (across all 3 categories)
  const totalSubmitted = (cats.adoption?.submitted ?? 0) + (cats.vaccination?.submitted ?? 0) + (cats.rescue?.submitted ?? 0);
  const totalPending   = (cats.adoption?.pending   ?? 0) + (cats.vaccination?.pending   ?? 0) + (cats.rescue?.pending   ?? 0);
  const totalAccepted  = (cats.adoption?.accepted  ?? 0) + (cats.vaccination?.accepted  ?? 0) + (cats.rescue?.accepted  ?? 0);
  const totalResolved  = (cats.adoption?.resolved  ?? 0) + (cats.vaccination?.resolved  ?? 0) + (cats.rescue?.resolved  ?? 0);

  // Trend chart
  const trendData = {
    labels: trend.map((t) => t.date),
    datasets: [
      {
        label: "For Adoption",
        data: trend.map((t) => t.adoption),
        backgroundColor: "#3b82f6",
        stack: "reports",
        borderRadius: 4,
      },
      {
        label: "Vaccination",
        data: trend.map((t) => t.vaccination),
        backgroundColor: "#06b6d4",
        stack: "reports",
        borderRadius: 4,
      },
      {
        label: "Animal Rescue",
        data: trend.map((t) => t.rescue),
        backgroundColor: "#ef4444",
        stack: "reports",
        borderRadius: 4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { font: { family: "Nunito", size: 12 }, padding: 16 } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { font: { family: "Nunito" } } },
      y: { stacked: true, beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { family: "Nunito" }, stepSize: 1 } },
    },
  };

  // Zone bar chart
  const zoneData = {
    labels: zones.map((z) => z.name),
    datasets: [{
      label: "Risk Score",
      data: zones.map((z) => z.riskScore),
      backgroundColor: zones.map((z) =>
        z.riskScore >= 80 ? "#ef4444" : z.riskScore >= 50 ? "#f59e0b" : "#22c55e"
      ),
      borderRadius: 8,
    }],
  };
  const zoneOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  const categoryRows = [
    { key: "adoption",    ...cats.adoption    },
    { key: "vaccination", ...cats.vaccination },
    { key: "rescue",      ...cats.rescue      },
  ];

  const rowColors = {
    adoption:    { bg: "#eff6ff", border: "#bfdbfe", badge: "#3b82f6" },
    vaccination: { bg: "#ecfeff", border: "#a5f3fc", badge: "#06b6d4" },
    rescue:      { bg: "#fff1f2", border: "#fecdd3", badge: "#ef4444" },
  };

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Admin Analytics | OurPetCare</title>
        <meta name="description" content="Detailed analytics for animal rescue, vaccination, and adoption across Tamil Nadu." />
      </Helmet>

      {/* ─── Header ─── */}
      <div className="py-10 px-6" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "rgba(255,255,255,0.2)" }}>📊</div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
                Analytics Dashboard
              </h1>
              <p className="text-sm" style={{ color: "#f7ede2" }}>Tamil Nadu animal rescue platform overview</p>
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm flex items-center gap-2">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        {/* ─── Timeline Filter ─── */}
        <div className="card p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-extrabold text-gray-500 mr-1">Period:</span>
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                className="px-4 py-2 rounded-full text-sm font-extrabold transition-all"
                style={
                  timeframe === tf.key
                    ? { background: "#3d8c78", color: "white" }
                    : { background: "#f3f4f6", color: "#374151" }
                }
                onMouseEnter={(e) => { if (timeframe !== tf.key) e.currentTarget.style.background = "#eaf5f1"; }}
                onMouseLeave={(e) => { if (timeframe !== tf.key) e.currentTarget.style.background = "#f3f4f6"; }}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Summary Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Submitted", value: summary.totalReports ?? 0, emoji: "📋", bg: "#f0f9ff", border: "#bae6fd", text: "#0369a1" },
            { label: "Pending",         value: summary.pendingReports ?? 0, emoji: "⏳", bg: "#fffbeb", border: "#fde68a", text: "#92400e" },
            { label: "In Progress",     value: summary.acceptedReports ?? 0, emoji: "🔄", bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" },
            { label: "Resolved",        value: summary.resolvedReports ?? 0, emoji: "✅", bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 text-center border"
              style={{ background: s.bg, borderColor: s.border }}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Fredoka', cursive", color: s.text }}>
                {s.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: s.text, opacity: 0.8 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ─── Category Breakdown Table ─── */}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              📂 Report Category Breakdown
            </h2>
            <span className="text-xs text-gray-400 font-semibold">
              {TIMEFRAMES.find((t) => t.key === timeframe)?.label}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-extrabold text-gray-600 uppercase tracking-wider text-xs w-44">Category</th>
                  <th className="text-center px-4 py-4 font-extrabold text-gray-600 uppercase tracking-wider text-xs">Submitted</th>
                  <th className="text-center px-4 py-4 font-extrabold text-amber-600 uppercase tracking-wider text-xs">Pending</th>
                  <th className="text-center px-4 py-4 font-extrabold text-violet-600 uppercase tracking-wider text-xs">In Progress</th>
                  <th className="text-center px-4 py-4 font-extrabold text-green-700 uppercase tracking-wider text-xs">Resolved</th>
                  <th className="text-center px-4 py-4 font-extrabold text-gray-600 uppercase tracking-wider text-xs">Resolution %</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row) => {
                  const rc = rowColors[row.key];
                  const rate = pct(row.resolved ?? 0, row.submitted ?? 0);
                  return (
                    <tr key={row.key} className="border-b border-gray-50">
                      {/* Category label */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: rc.badge }} />
                          <span className="font-extrabold text-gray-800">{row.emoji} {row.label}</span>
                        </div>
                      </td>
                      {/* Submitted */}
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-sm font-extrabold"
                          style={{ background: rc.bg, color: rc.badge, border: `1px solid ${rc.border}` }}>
                          {row.submitted ?? 0}
                        </span>
                      </td>
                      {/* Pending */}
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                          {row.pending ?? 0}
                        </span>
                      </td>
                      {/* In Progress */}
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-violet-50 text-violet-700 border border-violet-200">
                          {row.accepted ?? 0}
                        </span>
                      </td>
                      {/* Resolved */}
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-green-50 text-green-700 border border-green-200">
                          {row.resolved ?? 0}
                        </span>
                      </td>
                      {/* Rate */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${rate}%`, background: rate >= 70 ? "#22c55e" : rate >= 40 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                          <span className="font-extrabold text-gray-700 text-xs w-8">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Total row */}
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-gray-900 text-sm uppercase tracking-wide">Total</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-extrabold text-gray-800 text-base">{totalSubmitted}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-extrabold text-amber-700 text-base">{totalPending}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-extrabold text-violet-700 text-base">{totalAccepted}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-extrabold text-green-700 text-base">{totalResolved}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-extrabold text-gray-700 text-sm">{pct(totalResolved, totalSubmitted)}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Trend Chart ─── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              📈 Report Submissions Over Time
            </h2>
            <span className="text-xs text-gray-400 font-semibold">
              {TIMEFRAMES.find((t) => t.key === timeframe)?.label}
            </span>
          </div>
          <div className="h-72">
            {trend.length > 0 ? (
              <Bar data={trendData} options={trendOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-semibold">
                No report data for this period
              </div>
            )}
          </div>
        </div>

        {/* ─── Additional Stats Row ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Reports This Week",   value: analytics?.reportsThisWeek ?? 0, emoji: "📅", color: "#2e6b5a" },
            { label: "Total Animals",       value: summary.totalAnimals ?? 0,        emoji: "🐾", color: "#2e6b5a" },
            { label: "Active Zones",        value: zones.length,                     emoji: "📍", color: "#2e6b5a" },
            { label: "High Risk Zones",     value: zones.filter((z) => z.riskScore >= 80).length, emoji: "🔴", color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Fredoka', cursive", color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ─── Zone Risk Chart ─── */}
        {zones.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              📍 Zone Risk Scores
            </h2>
            <div className="h-64">
              <Bar data={zoneData} options={zoneOptions} />
            </div>
          </div>
        )}

        {/* ─── Zone Table ─── */}
        {zones.length > 0 && (
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
                  {zones.map((z, i) => (
                    <tr key={z.name}
                      className={`border-b border-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}
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
