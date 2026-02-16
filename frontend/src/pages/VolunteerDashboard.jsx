import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function VolunteerDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState('');
  const { user } = useAuth();



  useEffect(() => {
    const fetchReports = async () => {
      try {
        const url = zone ? `/reports?zone=${encodeURIComponent(zone)}` : '/reports';
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

    setReports((prev) =>
      prev.map((r) => (r._id === id ? res.data : r))
    );
  } catch (err) {
    alert(err.message);
  }
};

  const resolveReport = async (id) => {
    try {
      await apiClient.patch(`/reports/${id}/resolve`);
      setReports((p) => p.map((r) => (r._id === id ? { ...r, status: 'resolved' } : r)));
    } catch (err) {
      alert(err.message);
    }
  };


  const unassignReport = async (id) => {
  try {
    const res = await apiClient.patch(`/reports/${id}/unassign`);
    setReports((prev) =>
      prev.map((r) => (r._id === id ? res.data : r))
    );
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Volunteer Dashboard</h1>

      <div className="mb-6 flex gap-4 items-center">
        <label className="text-sm text-slate-600">Filter by zone:</label>
        <input
          type="text"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          placeholder="Zone"
          className="border border-slate-300 rounded-lg px-3 py-1.5 w-40"
        />
      </div>

      {loading ? (
        <p className="text-slate-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-slate-500">No reports found</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
            >

              <div className="flex-wrap flex justify-between items-center">
                 {r.photo && (
            <a href={r.photo} download={`report-${r._id}.jpg`}>
              <img
                src={r.photo}
                alt="Animal"
                className="mt-2 w-48 h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
              />
            </a>
          )}
                <div className="flex-1 mx-4">
                  <p className="text-sm font-medium text-slate-800">{r.animal?.species?.toUpperCase() || 'Unknown Species'}</p>
                  <span className="text-sm font-medium text-slate-800">{r.condition?.toUpperCase()}</span>
                 
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-100">{r.status}</span>
                  
                  
                  <p className="text-slate-600 text-sm mt-1">{r.description}</p>
                  <p className="text-xs text-slate-400 mt-1 py-2 md:py-0">Zone: {r.zone || '—'}</p>

                </div>
                {r.reportedBy && (
  <div className="text-sm font-semibold text-slate-700 ">
    <p className="font-medium text-slate-700">Reporter Details</p>
    <p>Name: {r.reportedBy.name}</p>
    <p>Email: {r.reportedBy.email}</p>
    {r.reportedBy.phone && <p>Phone: {r.reportedBy.phone}</p>}
  </div>
)}
              
               
                <div className="flex gap-2 ml-4">

  {/* Pending */}
  {r.status === 'pending' && (
    <button
      onClick={() => acceptReport(r._id)}
      className="text-sm px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
    >
      Accept
    </button>
  )}

  {/* Accepted */}
  {r.status === 'accepted' && (
    <>
      {/* If current volunteer accepted */}
      {r.acceptedBy?._id === user.id ? (
        <>
          <button
            onClick={() => resolveReport(r._id)}
            className="text-sm px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800"
          >
            Resolve
          </button>

          <button
            onClick={() => unassignReport(r._id)}
            className="text-sm px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Give Back
          </button>
        </>
      ) : (
        <button
          disabled
          className="text-sm px-3 py-1 bg-slate-300 text-slate-600 rounded cursor-not-allowed"
        >
          In Progress
        </button>
      )}
    </>
  )}

  {/* Resolved */}
  {r.status === 'resolved' && (
    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded">
      Completed
    </span>
  )}

</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
