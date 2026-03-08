import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

export default function AccountPage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Use user from auth context
    if (authUser) {
      setUser(authUser);
    }
    fetchReports();
  }, [authUser]);

  const fetchReports = async () => {
    try {
      const reportRes = await apiClient.get("/reports?mine=true");
      setReports(reportRes.data);
    } catch (err) {
      console.error(err);
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

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Account Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">
          My Account
        </h1>

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
            <p className="text-slate-400">Joined</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* User Reports */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          My Reports
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((r) => (
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
                <h3 className="font-medium text-slate-800">
                  {r.animal?.species?.toUpperCase()}
                </h3>

                <p className="text-sm text-slate-600">
                  Condition: {r.condition}
                </p>

                <p className="text-sm text-slate-500">Zone: {r.zone}</p>

                <p className="text-xs text-slate-400">
                  Posted: {new Date(r.createdAt).toLocaleDateString()}
                </p>

                <span className="inline-block text-xs px-2 py-1 rounded bg-slate-100">
                  {r.status}
                </span>

                {/* Buttons */}
                <div className="flex gap-2 pt-3">
                  <button className="flex-1 bg-gray-600 text-white text-sm rounded-lg py-2 hover:bg-gray-700">
                    Edit
                  </button>

                  <button
                    onClick={() => deleteReport(r._id)}
                    className="flex-1 bg-red-600 text-white text-sm rounded-lg py-2 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
