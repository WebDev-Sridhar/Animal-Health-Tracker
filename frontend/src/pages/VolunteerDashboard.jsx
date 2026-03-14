import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const RESCUE_CONDITIONS = ["sick", "critical", "injured", "aggressive"];

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
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/reports");
        setAllReports(res.data || []);
      } catch {
        setAllReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const acceptReport = async (id) => {
    try {
      const res = await apiClient.patch(`/reports/${id}/accept`);
      setAllReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) { alert(err.message); }
  };

  const unassignReport = async (id) => {
    try {
      const res = await apiClient.patch(`/reports/${id}/unassign`);
      setAllReports((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) { alert(err.message); }
  };

  const sendWhatsAppNotification = (r) => {
    const phone = r.reportedBy?.phone?.replace(/\D/g, "");
    if (!phone) { alert("Reporter has no phone number on file."); return; }
    const accountUrl = `${window.location.origin}/account`;
    const reportDate = new Date(r.createdAt).toLocaleDateString("en-GB");
    const message =
      `Hi ${r.reportedBy?.name || "there"},\n\n` +
      `A volunteer from OurPetCare has attended to your animal report 🐾\n\n` +
      `📋 Report Details:\n` +
      `• Animal: ${r.animal?.species || "Unknown"}\n` +
      `• Zone: ${r.zone || "Unknown"}\n` +
      `• Condition: ${r.condition}\n` +
      `• Reported on: ${reportDate}\n\n` +
      `The issue appears to have been resolved. Please visit your account page to confirm and mark it as resolved:\n` +
      `🔗 ${accountUrl}\n\n` +
      `You may also ask us for photos of the rescued animal to verify. Reply to this message if you have any questions.\n\n` +
      `Thank you for caring! 🌿\n— OurPetCare Team`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Apply zone + category filters
  const filtered = allReports
    .filter((r) => !zone || r.zone?.toLowerCase().includes(zone.toLowerCase()))
    .filter((r) => {
      if (category === "rescue") return RESCUE_CONDITIONS.includes(r.condition);
      if (category === "vaccination") return r.condition === "vaccination-needed";
      if (category === "adoption") return r.condition === "for-adoption";
      return true;
    });

  const pending = filtered.filter((r) => r.status === "pending");
  const accepted = filtered.filter((r) => r.status === "accepted");
  const resolved = filtered.filter((r) => r.status === "resolved");

  const CATEGORY_PILLS = [
    { key: "all", label: "All" },
    { key: "rescue", label: "Rescue" },
    { key: "vaccination", label: "Vaccination" },
    { key: "adoption", label: "Adoption" },
  ];

  const ReportCard = ({ r }) => {
    const isAssignedToMe = r.acceptedBy?._id === user.id;
    const hasBeenAccepted24h = r.acceptedAt &&
      Date.now() - new Date(r.acceptedAt).getTime() >= 24 * 60 * 60 * 1000;

    return (
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {r.photo && (
            <a href={r.photo} download={`report-${r._id}.jpg`} className="flex-shrink-0">
              <img src={r.photo} alt="Animal"
                className="w-full h-44 sm:w-36 sm:h-full object-cover hover:opacity-90 transition" />
            </a>
          )}

          <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-extrabold text-gray-800 capitalize" style={{ fontFamily: "'Fredoka', cursive" }}>
                  {r.animal?.species || "Unknown"} — {r.zone || "No zone"}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className={`badge ${conditionBadge(r.condition)} text-xs`}>{r.condition}</span>
                <span className={`badge ${statusBadge(r.status)} text-xs`}>{r.status}</span>
              </div>
              {r.description && (
                <p className="text-gray-600 text-sm mb-1 line-clamp-2">{r.description}</p>
              )}
              <p className="text-xs text-gray-400">
                📅 {new Date(r.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-3 pt-2 border-t border-gray-50">
              {r.reportedBy && (
                <div className="text-sm">
                  <p className="font-extrabold text-gray-500 text-xs uppercase tracking-wide mb-1">Reporter</p>
                  <p className="font-bold text-gray-800">{r.reportedBy.name}</p>
                  <p className="text-gray-500 text-xs">{r.reportedBy.email}</p>
                  {r.reportedBy.phone && (
                    <a href={`tel:${r.reportedBy.phone}`}
                      className="inline-flex items-center gap-1 mt-1 text-xs font-bold"
                      style={{ color: "#3d8c78" }}>
                      📞 {r.reportedBy.phone}
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-row sm:flex-col gap-2 ml-auto">
                {r.status === "pending" && (
                  <button onClick={() => acceptReport(r._id)}
                    className="px-4 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105 shadow-sm"
                    style={{ background: "var(--primary)" }}>
                    ✅ Accept
                  </button>
                )}

                {r.status === "accepted" && isAssignedToMe && (
                  <>
                    {hasBeenAccepted24h ? (
                      <button onClick={() => sendWhatsAppNotification(r)}
                        className="px-4 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105 shadow-sm"
                        style={{ background: "#25D366" }}>
                         Notify Reporter
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-full text-sm font-bold text-center bg-gray-100 text-gray-400 text-xs">
                        📩 Available in 24h
                      </span>
                    )}
                    <button onClick={() => unassignReport(r._id)}
                      className="px-4 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105 shadow-sm"
                      style={{ background: "#d97706" }}>
                       Give Back
                    </button>
                  </>
                )}

                {r.status === "accepted" && !isAssignedToMe && (
                  <span className="px-4 py-2 rounded-full text-sm font-bold text-center bg-gray-100 text-gray-500">
                    In Progress
                  </span>
                )}

                {r.status === "resolved" && (
                  <span className="px-4 py-2 rounded-full text-sm font-bold text-center badge-green">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ emoji, label, count, color }) => (
    <div className="flex items-center gap-3 mb-3 mt-6 first:mt-0">
      <span className="text-xl">{emoji}</span>
      <h3 className="font-extrabold text-gray-700" style={{ fontFamily: "'Fredoka', cursive" }}>
        {label}
        <span className="ml-2 text-sm font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: color }}>
          {count}
        </span>
      </h3>
    </div>
  );

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Volunteer Dashboard | OurPetCare</title>
        <meta name="description" content="Manage animal welfare reports and contribute to saving animals across Tamil Nadu." />
      </Helmet>

      {/* ─── Header ─── */}
      <div className="py-10 px-6" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: "rgba(255,255,255,0.2)" }}>🤝</div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
                Volunteer Dashboard
              </h1>
              <p style={{ color: "#f7ede2" }}>Welcome back, {user?.name?.split(" ")[0]} — {user?.zone || "All zones"}</p>
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
                <div className="text-xs font-semibold" style={{ color: "#f7ede2" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ─── How It Works Guide ─── */}
        <details className="card mb-6 group">
          <summary className="flex items-center justify-between p-5 cursor-pointer select-none list-none">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <span className="font-extrabold text-gray-800" style={{ fontFamily: "'Fredoka', cursive" }}>
                How to Use This Dashboard
              </span>
            </div>
            <span className="text-gray-400 text-sm font-bold group-open:hidden">Show guide ▼</span>
            <span className="text-gray-400 text-sm font-bold hidden group-open:inline">Hide ▲</span>
          </summary>
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500 mb-4">As a volunteer, you help connect reporters with rescued animals. Here's how the workflow works:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { step: "1", emoji: "⏳", title: "Accept a Pending Report", desc: "Browse pending reports and click Accept to take responsibility. The report moves to In Progress and is assigned to you." },
                { step: "2", emoji: "🚑", title: "Attend to the Animal", desc: "Go to the reported location and help the animal — rescue, vaccination, or connect with an adopter, depending on the condition." },
                { step: "3", emoji: "📩", title: "Notify the Reporter (after 24h)", desc: "After 24 hours, the Notify Reporter button becomes active. Click it to send a WhatsApp message to the reporter with a confirmation link." },
                { step: "4", emoji: "✅", title: "Reporter Confirms & Closes", desc: "The reporter visits their account page, reviews the update, and clicks Resolved to officially close the report." },
                { step: "5", emoji: "↩️", title: "Give Back (if needed)", desc: "If you're unable to attend to a report, use Give Back to return it to the pending queue for another volunteer." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 p-3 rounded-2xl" style={{ background: "#f7faf9" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                    style={{ background: "var(--primary)" }}>
                    {item.step}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-sm">{item.emoji} {item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* ─── Filters ─── */}
        <div className="card p-4 mb-6 space-y-3">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="text-sm font-extrabold text-gray-600">🔍 Filter by zone:</label>
            <input type="text" value={zone} onChange={(e) => setZone(e.target.value)}
              placeholder="Type zone name..." className="input-field max-w-xs py-2.5 text-sm" />
            {zone && (
              <button onClick={() => setZone("")} className="text-sm font-bold underline underline-offset-2 transition-colors"
                style={{ color: "#3d8c78" }}>
                Clear
              </button>
            )}
            <span className="ml-auto text-sm text-gray-500 font-semibold">{filtered.length} reports</span>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-sm font-extrabold text-gray-600">Category:</label>
            {CATEGORY_PILLS.map((p) => (
              <button key={p.key} onClick={() => setCategory(p.key)}
                className="px-3 py-1.5 rounded-full text-sm font-extrabold transition-all"
                style={category === p.key
                  ? { background: "#2e6b5a", color: "white" }
                  : { background: "#eaf5f1", color: "#2e6b5a" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-3"
                style={{ borderColor: "#d0ece5", borderTopColor: "#3d8c78" }} />
              <p className="text-gray-600 font-semibold">Loading reports...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="text-xl font-bold text-gray-700" style={{ fontFamily: "'Fredoka', cursive" }}>No reports found</h3>
            <p className="text-gray-500 mt-2 text-sm">
              {zone || category !== "all" ? "Try adjusting your filters." : "No reports submitted yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { label: "Pending", data: pending, color: "#d97706" },
              { label: "In Progress", data: accepted, color: "#3b82f6" },
              { label: "Resolved", data: resolved, color: "#16a34a" },
            ].map(({ label, data, color }) =>
              data.length > 0 && (
                <div key={label}>
                  <SectionHeader label={label} count={data.length} color={color} />
                  <div className="space-y-4">
                    {data.map((r) => <ReportCard key={r._id} r={r} />)}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
