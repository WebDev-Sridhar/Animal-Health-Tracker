import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { apiClient } from '../api/client';
import { analyticsApi } from '../api/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CHART_COLORS = {
  healthy: '#22c55e',
  sick:  '#8b5cf6' ,
  critical: '#ef4444',
  injured: '#f59e0b',
  vaccination_needed: '#3b82f6',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recalcLoading, setRecalcLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await analyticsApi.getAnalytics();
      setAnalytics(res.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const recalculateRisk = async () => {
    setRecalcLoading(true);
    try {
      await apiClient.post('/risk/recalculate');
      await fetchAnalytics();
    } catch (err) {
      setError(err.message || 'Recalculation failed');
    } finally {
      setRecalcLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-75">
        <span className="text-slate-500">Loading analytics...</span>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Animals', value: analytics?.totalAnimals ?? 0, color: 'bg-slate-600' },
    { label: 'Sick Animals', value: analytics?.sickAnimals ?? 0, color: 'bg-amber-500' },
    { label: 'Vaccinated', value: analytics?.vaccinatedAnimals ?? 0, color: 'bg-emerald-500' },
    { label: 'Reports This Week', value: analytics?.reportsThisWeek ?? 0, color: 'bg-blue-500' },
  ];

  const healthData = {
    labels: Object.keys(analytics?.healthBreakdown ?? {}).map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [
      {
        data: Object.values(analytics?.healthBreakdown ?? {}),
        backgroundColor: Object.keys(analytics?.healthBreakdown ?? {}).map(
          (k) => CHART_COLORS[k] || CHART_COLORS.unknown
        ),
        borderWidth: 0,
      },
    ],
  };

  const zoneData = {
    labels: (analytics?.zones ?? []).map((z) => z.name),
    datasets: [
      {
        label: 'Risk Score',
        data: (analytics?.zones ?? []).map((z) => z.riskScore),
        backgroundColor: (analytics?.zones ?? []).map((z) =>
          z.riskScore >= 80 ? '#ef4444' : z.riskScore >= 50 ? '#f59e0b' : '#22c55e'
        ),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Admin Analytics Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm"
          >
            Refresh
          </button>
          <button
            onClick={recalculateRisk}
            disabled={recalcLoading}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 text-sm"
          >
            {recalcLoading ? 'Recalculating...' : 'Recalc Zone Risk'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
          >
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
            <div className={`mt-2 h-1 w-12 rounded ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Health Status Breakdown</h2>
          <div className="h-64">
            {Object.keys(analytics?.healthBreakdown ?? {}).length > 0 ? (
              <Doughnut data={healthData} options={chartOptions} />
            ) : (
              <p className="text-slate-500 flex items-center justify-center h-full">No animal data</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Zone Risk Scores</h2>
          <div className="h-64">
            {(analytics?.zones ?? []).length > 0 ? (
              <Bar data={zoneData} options={barOptions} />
            ) : (
              <p className="text-slate-500 flex items-center justify-center h-full">
                No zone data. Run recalculation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Zone table */}
      {(analytics?.zones ?? []).length > 0 && (
        <div className="mt-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 px-6 pt-6 pb-2">Zone Risk Details</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3">Zone</th>
                <th className="text-left px-6 py-3">Risk Score</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.zones.map((z) => (
                <tr key={z.name} className="border-b border-slate-100">
                  <td className="px-6 py-3">{z.name}</td>
                  <td className="px-6 py-3">{z.riskScore}</td>
                  <td className="px-6 py-3">
                    <span
                      className={
                        z.riskScore >= 80
                          ? 'text-red-600 font-medium'
                          : z.riskScore >= 50
                            ? 'text-amber-600'
                            : 'text-slate-500'
                      }
                    >
                      {z.riskScore >= 80 ? 'High Risk' : z.riskScore >= 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
