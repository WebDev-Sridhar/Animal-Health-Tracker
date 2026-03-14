import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../hooks/useChat";

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

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return formatTime(iso);
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// ── Inline Chat Conversation Component ──
function ChatConversation({ reportId, contactName, onBack, onClearChat, onDeleteChat }) {
  const { user } = useAuth();
  const { markChatRead } = useSocket();
  const { messages, sendMessage, markRead, loading, clearMessages } = useChat(reportId);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (reportId) {
      markRead();
      markChatRead(reportId);
      // Mark as read on backend
      apiClient.patch(`/chat/${reportId}/read`).catch(() => {});
    }
  }, [reportId, markRead, markChatRead, messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear all messages in this chat? This cannot be undone.')) return;
    try {
      await apiClient.delete(`/chat/${reportId}/clear`);
      clearMessages();
      if (onClearChat) onClearChat();
    } catch {
      alert('Failed to clear chat');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this entire conversation? This cannot be undone.')) return;
    try {
      await apiClient.delete(`/chat/${reportId}`);
      clearMessages();
      if (onDeleteChat) onDeleteChat();
    } catch {
      alert('Failed to delete conversation');
    }
  };

  return (
    <div className="card overflow-hidden flex flex-col" style={{ height: 520 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
        <button onClick={onBack} className="text-white text-lg font-bold hover:opacity-80 transition" aria-label="Back">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-extrabold text-sm truncate" style={{ fontFamily: "'Fredoka', cursive" }}>
            {contactName || 'Chat'}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setShowActions(!showActions)} className="text-white text-lg hover:opacity-80 transition" aria-label="Actions">
            ⋮
          </button>
          {showActions && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg py-1 z-10 min-w-[140px]">
              <button onClick={() => { setShowActions(false); handleClear(); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-semibold">
                Clear Chat
              </button>
              <button onClick={() => { setShowActions(false); handleDelete(); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold">
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ background: '#f9fbfa' }}>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#d0ece5', borderTopColor: '#3d8c78' }} />
              <p className="text-gray-400 text-xs font-semibold">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm text-center">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === (user?.id || user?._id);
            return (
              <div key={msg._id} className="flex flex-col" style={{ alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                {!isOwn && (
                  <span className="text-[10px] text-gray-400 font-semibold mb-0.5 ml-1">{msg.senderName}</span>
                )}
                <div style={{
                  maxWidth: '78%', padding: '8px 12px',
                  borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isOwn ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : '#fff',
                  color: isOwn ? '#fff' : '#1e3d30',
                  fontSize: 13, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  wordBreak: 'break-word', lineHeight: 1.45,
                }}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-300 mt-0.5 mx-1">{formatTime(msg.createdAt)}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 px-3 py-2.5 bg-white" style={{ borderTop: '1px solid rgba(61,140,120,0.1)' }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Type a message..." rows={1}
          className="flex-1 resize-none outline-none text-sm py-2 px-3 rounded-xl"
          style={{ border: '1.5px solid rgba(61,140,120,0.25)', fontFamily: 'inherit', lineHeight: 1.4 }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(61,140,120,0.25)')}
        />
        <button onClick={handleSend} disabled={!input.trim()} className="btn-primary"
          style={{ padding: '8px 16px', fontSize: 13, minWidth: 'auto', flexShrink: 0 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user: authUser, login, isAuthenticated } = useAuth();
  const { unreadChats, markChatRead } = useSocket();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [editingUser, setEditingUser] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [formData, setFormData] = useState({});
  const [reportFormData, setReportFormData] = useState({});
  const [reportPhotoFile, setReportPhotoFile] = useState(null);
  const [reportPhotoPreview, setReportPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acceptedReports, setAcceptedReports] = useState([]);
  const [toast, setToast] = useState(null);

  // Chat state
  const [chatView, setChatView] = useState('list'); // 'list' | 'conversation'
  const [activeChatReportId, setActiveChatReportId] = useState(null);
  const [activeChatName, setActiveChatName] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({ name: authUser.name, phone: authUser.phone || "", zone: authUser.zone || "" });
      fetchReports();
    }
  }, [authUser]);

  // Fetch conversations
  useEffect(() => {
    if (isAuthenticated) fetchConversations();
  }, [isAuthenticated]);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const res = await apiClient.get('/chat/conversations');
      setConversations(res.data || res || []);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const reportRes = await apiClient.get("/reports");
      const userId = authUser?._id || authUser?.id;
      const allData = reportRes.data || [];
      const myReports = allData.filter((r) => {
        const reporterId = r.reportedBy?._id || r.reportedBy;
        return reporterId?.toString() === userId?.toString();
      });
      const myAccepted = allData.filter((r) => {
        const acceptedById = r.acceptedBy?._id || r.acceptedBy;
        return acceptedById?.toString() === userId?.toString();
      });
      setReports(myReports);
      setAcceptedReports(myAccepted);
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
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setEditingReportId(report._id);
    setReportFormData({ condition: report.condition, zone: report.zone, description: report.description || "" });
    setReportPhotoFile(null);
    setReportPhotoPreview(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReportPhotoFile(file);
    setReportPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveReport = async (reportId) => {
    setLoading(true);
    try {
      let body;
      if (reportPhotoFile) {
        body = new FormData();
        Object.entries(reportFormData).forEach(([k, v]) => body.append(k, v));
        body.append("photo", reportPhotoFile);
      } else {
        body = reportFormData;
      }
      const res = await apiClient.patch(`/reports/${reportId}`, body);
      const updated = res.data || {};
      setReports(reports.map((r) => r._id === reportId ? { ...r, ...reportFormData, photo: updated.photo || reportPhotoPreview || r.photo } : r));
      setEditingReportId(null);
      setReportPhotoFile(null);
      setReportPhotoPreview(null);
      showToast("Report updated successfully");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to update report", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGiveBack = async (id) => {
    if (!window.confirm("Return this report to the pending queue? Another volunteer can then accept it.")) return;
    try {
      await apiClient.patch(`/reports/${id}/unassign`);
      setAcceptedReports((prev) => prev.filter((r) => r._id !== id));
      showToast("Report returned to pending queue");
    } catch (err) {
      showToast(err.message || "Failed to give back report", "error");
    }
  };

  const handleResolveReport = async (id) => {
    if (!window.confirm("Mark this report as resolved? This confirms the issue has been addressed.")) return;
    try {
      await apiClient.patch(`/reports/${id}/resolve`, {});
      setReports(reports.map((r) => r._id === id ? { ...r, status: "resolved" } : r));
      showToast("Report marked as resolved");
    } catch (err) {
      showToast(err.message || "Failed to resolve report", "error");
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r._id !== id));
      showToast("Report deleted");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to delete report", "error");
    }
  };

  const openChat = (reportId, name) => {
    setActiveChatReportId(reportId);
    setActiveChatName(name);
    setChatView('conversation');
    markChatRead(reportId);
    setTimeout(() => {
      document.getElementById('my-chats-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
            <button onClick={() => navigate("/register")} className="text-[#3d8c78] hover:text-[#2e6b5a] font-extrabold">
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
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#d0ece5", borderTopColor: "#3d8c78" }} />
          <p className="text-gray-600 font-semibold">Loading your account...</p>
        </div>
      </div>
    );
  }

  const roleColors = { admin: "badge-red", volunteer: "badge-teal", public: "badge-blue" };

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-lg text-sm font-bold text-white transition-all"
          style={{ background: toast.type === "error" ? "#ef4444" : "#3d8c78", minWidth: "220px", justifyContent: "center" }}>
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          <span>{toast.msg}</span>
        </div>
      )}
      <Helmet>
        <title>My Account | OurPetCare</title>
        <meta name="description" content="Manage your OurPetCare account, view your reports, and track your contribution to animal welfare." />
      </Helmet>

      {/* ─── Header ─── */}
      <div className="relative py-10 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg"
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
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold hover:bg-[#d0ece5] transition-colors" style={{ color: "#2e6b5a", background: "#eaf5f1" }}>
                Edit Profile
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
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone || "Not added" },
                { label: "Role", value: user.role, capitalize: true },
                { label: "Zone", value: user.zone || "Not added" },
                { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString('en-GB') },
              ].map(({ label, value, capitalize }) => (
                <div key={label} className="p-4 rounded-2xl bg-gray-50">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                  <p className={`font-bold text-gray-800 ${capitalize ? "capitalize" : ""}`}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── My Chats ─── */}
        <div id="my-chats-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              My Chats
            </h2>
          </div>

          {chatView === 'conversation' && activeChatReportId ? (
            <ChatConversation
              reportId={activeChatReportId}
              contactName={activeChatName}
              onBack={() => { setChatView('list'); setActiveChatReportId(null); fetchConversations(); }}
              onClearChat={() => fetchConversations()}
              onDeleteChat={() => { setChatView('list'); setActiveChatReportId(null); fetchConversations(); }}
            />
          ) : (
            <div className="space-y-2">
              {loadingConversations ? (
                <div className="card p-10 text-center">
                  <div className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#d0ece5', borderTopColor: '#3d8c78' }} />
                  <p className="text-gray-500 text-sm font-semibold">Loading chats...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="card p-10 text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: "'Fredoka', cursive" }}>No chats yet</h3>
                  <p className="text-gray-400 text-sm">Chats will appear here when you or a volunteer starts a conversation on an accepted report.</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const unread = unreadChats[conv.reportId]?.count || conv.unreadCount || 0;
                  return (
                    <button key={conv.reportId}
                      onClick={() => openChat(conv.reportId, conv.otherUser?.name || 'Chat')}
                      className="card w-full text-left flex items-center gap-3 p-4 hover:shadow-md transition-shadow cursor-pointer">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 uppercase"
                        style={{ background: '#d4e4e1', color: '#2e6b5a' }}>
                        {conv.otherUser?.name?.[0] || '?'}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-gray-800 text-sm truncate">{conv.otherUser?.name || 'Unknown'}</p>
                          <span className="text-[11px] text-gray-400 font-semibold flex-shrink-0 ml-2">
                            {formatDate(conv.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-gray-400 truncate flex-1">
                            <span className="text-gray-500 capitalize">{conv.reportSpecies}</span>
                            {conv.lastMessage && <span> · {conv.lastMessage}</span>}
                          </p>
                          {unread > 0 && (
                            <span className="flex-shrink-0 ml-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white"
                              style={{ background: '#ef4444' }}>
                              {unread > 9 ? '9+' : unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ─── My Reports ─── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
              My Reports ({reports.length})
            </h2>
          </div>

          {/* How It Works note */}
          <details className="card mb-5 group">
            <summary className="flex items-center justify-between p-4 cursor-pointer select-none list-none">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <span className="font-extrabold text-gray-700 text-sm">How does the report process work?</span>
              </div>
              <span className="text-gray-400 text-xs font-bold group-open:hidden">Show ▼</span>
              <span className="text-gray-400 text-xs font-bold hidden group-open:inline">Hide ▲</span>
            </summary>
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <div className="space-y-2.5">
                {[
                  { emoji: "📋", title: "You submit a report", desc: "Describe the animal's condition, location, and photo. Your report is listed as Pending." },
                  { emoji: "🤝", title: "A volunteer accepts it", desc: "A local volunteer accepts your report and attends to the animal. The status changes to In Progress." },
                  { emoji: "📩", title: "You get a WhatsApp message", desc: "Once the volunteer has handled the issue, they'll send you a WhatsApp notification with details." },
                  { emoji: "✅", title: "You confirm & mark resolved", desc: "Visit this page and click the Resolved button on your report card to officially close it. You can also ask the volunteer for photos before confirming." },
                ].map((item) => (
                  <div key={item.emoji} className="flex gap-3 items-start">
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <div>
                      <span className="font-extrabold text-gray-700 text-sm">{item.title} — </span>
                      <span className="text-gray-500 text-sm">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 border-t border-gray-100 pt-3">
                You can also mark your own report as resolved at any time — for example, if the animal was already taken care of before a volunteer responded.
              </p>
            </div>
          </details>

          <div className="grid md:grid-cols-2 gap-5">
            {loadingReports ? (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#d0ece5", borderTopColor: "#3d8c78" }} />
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
                        <div>
                          <label className="text-xs font-extrabold text-gray-600 uppercase tracking-wide">Photo</label>
                          <div className="mt-1.5">
                            {(reportPhotoPreview || r.photo) && (
                              <img src={reportPhotoPreview || r.photo} alt="preview"
                                className="w-full h-32 object-cover rounded-xl mb-2" />
                            )}
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer border-2 border-dashed transition-colors hover:border-[#3d8c78] hover:bg-[#eaf5f1]"
                              style={{ borderColor: "#d0ece5", color: "#3d8c78" }}>
                              📷 {reportPhotoPreview ? "Change Photo" : "Replace Photo"}
                              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </label>
                          </div>
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
                            <p className="text-xs text-gray-500 mt-0.5"> {r.zone}</p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <span className={`badge ${conditionBadge(r.condition)} text-xs`}>{r.condition}</span>
                            <span className={`badge ${statusBadge(r.status)} text-xs`}>{r.status}</span>
                          </div>
                        </div>

                        {r.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{r.description}</p>
                        )}

                        {r.status === "accepted" && r.acceptedBy?.name && (
                          <div className="p-3 rounded-lg mb-3" style={{ background: "#eaf5f1" }}>
                            <p className="text-xs font-extrabold uppercase tracking-wide mb-1" style={{ color: "#2e6b5a" }}>
                              Volunteer Assigned
                            </p>
                            <p className="font-bold text-gray-800 text-sm">{r.acceptedBy.name}</p>
                            {r.acceptedBy.zone && (
                              <p className="text-xs text-gray-500">{r.acceptedBy.zone}</p>
                            )}
                            {r.acceptedBy.phone && (
                              <a href={`tel:${r.acceptedBy.phone}`}
                                className="inline-flex items-center gap-1 text-xs font-bold mt-1"
                                style={{ color: "#3d8c78" }}>
                                📞 {r.acceptedBy.phone}
                              </a>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mb-4">
                          Posted: {new Date(r.createdAt).toLocaleDateString('en-GB')}
                        </p>

                        <div className="flex gap-2 flex-wrap">
                          {r.status === "accepted" && r.acceptedBy?.name && (
                            <button
                              onClick={() => openChat(r._id, r.acceptedBy.name)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-white transition-colors"
                              style={{ background: "var(--primary)" }}>
                              Chat
                            </button>
                          )}
                          {r.status === "pending" && (
                            <button onClick={() => handleEditReport(r)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold hover:bg-[#d0ece5] transition-colors" style={{ color: "#2e6b5a", background: "#eaf5f1" }}>
                              Edit
                            </button>
                          )}
                          {r.status !== "resolved" && (
                            <button onClick={() => handleResolveReport(r._id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
                              Resolved
                            </button>
                          )}
                          {r.status !== "resolved" && (
                            <button onClick={() => deleteReport(r._id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-red-700 bg-red-50 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ─── Reports I'm Handling (volunteers only) ─── */}
        {user.role === "volunteer" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                Reports I'm Handling ({acceptedReports.length})
              </h2>
            </div>

            {acceptedReports.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">🤝</div>
                <p className="text-gray-600 font-semibold">You haven't accepted any reports yet.</p>
                <p className="text-gray-400 text-sm mt-1">Visit the Volunteer Dashboard to accept and handle reports.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {acceptedReports.map((r) => {
                  const hasBeenAccepted24h = r.acceptedAt &&
                    Date.now() - new Date(r.acceptedAt).getTime() >= 24 * 60 * 60 * 1000;

                  const sendWhatsApp = () => {
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

                  return (
                    <div key={r._id} className="card overflow-hidden">
                      {r.photo && (
                        <img src={r.photo} alt="animal" className="w-full h-40 object-cover" />
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-extrabold text-gray-800 capitalize" style={{ fontFamily: "'Fredoka', cursive" }}>
                              {r.animal?.species?.toUpperCase() || "Animal"}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">{r.zone}</p>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <span className={`badge ${conditionBadge(r.condition)} text-xs`}>{r.condition}</span>
                            <span className={`badge ${statusBadge(r.status)} text-xs`}>{r.status}</span>
                          </div>
                        </div>

                        {r.reportedBy && (
                          <div className="p-3 rounded-lg mb-3" style={{ background: "#f7faf9" }}>
                            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wide mb-1">Reporter</p>
                            <p className="font-bold text-gray-800 text-sm">{r.reportedBy.name}</p>
                            {r.reportedBy.phone && (
                              <a href={`tel:${r.reportedBy.phone}`} className="text-xs font-bold" style={{ color: "#3d8c78" }}>
                                📞 {r.reportedBy.phone}
                              </a>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mb-4">
                          Accepted: {r.acceptedAt ? new Date(r.acceptedAt).toLocaleDateString("en-GB") : "—"}
                        </p>

                        <div className="flex flex-col gap-2">
                          {r.status !== "resolved" && (
                            hasBeenAccepted24h ? (
                              <button onClick={sendWhatsApp}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-extrabold text-white hover:scale-105 transition-all shadow-sm"
                                style={{ background: "#25D366" }}>
                                📩 Notify Reporter
                              </button>
                            ) : (
                              <div className="w-full py-2.5 rounded-full text-sm font-bold text-center bg-gray-100 text-gray-400">
                                📩 Notify available after 24h
                              </div>
                            )
                          )}
                          {r.status === "accepted" && (
                            <button
                              onClick={() => openChat(r._id, r.reportedBy?.name || "Reporter")}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-extrabold text-white hover:scale-105 transition-all shadow-sm"
                              style={{ background: "var(--primary)" }}>
                              💬 Chat with Reporter
                            </button>
                          )}
                          {r.status === "accepted" && (
                            <button onClick={() => handleGiveBack(r._id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-extrabold text-white hover:scale-105 transition-all shadow-sm"
                              style={{ background: "#d97706" }}>
                              Give Back
                            </button>
                          )}
                          {r.status === "resolved" && (
                            <div className="w-full py-2.5 rounded-full text-sm font-bold text-center badge-green">
                              Resolved
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
