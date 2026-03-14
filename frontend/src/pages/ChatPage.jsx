import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../hooks/useChat";
import { apiClient } from "../api/client";

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

// ── Conversation View ──
function ChatConversation({ reportId, contactName, onBack }) {
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
    if (!window.confirm('Clear all messages? Messages will only be cleared for you.')) return;
    try {
      await apiClient.delete(`/chat/${reportId}/clear`);
      clearMessages();
      onBack();
    } catch {
      alert('Failed to clear chat');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this chat? Your sent messages will show as "deleted" for the other user, and the chat will be removed from your list.')) return;
    try {
      await apiClient.delete(`/chat/${reportId}`);
      clearMessages();
      onBack();
    } catch {
      alert('Failed to delete conversation');
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)' }}>
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
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg py-1 z-10 min-w-[160px]">
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
            const isDeletedMsg = msg.isDeleted === true;
            return (
              <div key={msg._id} className="flex flex-col" style={{ alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                {!isOwn && (
                  <span className="text-[10px] text-gray-400 font-semibold mb-0.5 ml-1">{msg.senderName}</span>
                )}
                <div style={{
                  maxWidth: '78%', padding: '8px 12px',
                  borderRadius: isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isDeletedMsg
                    ? '#f1f5f9'
                    : isOwn ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : '#fff',
                  color: isDeletedMsg ? '#94a3b8' : isOwn ? '#fff' : '#1e3d30',
                  fontSize: 13, boxShadow: isDeletedMsg ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
                  wordBreak: 'break-word', lineHeight: 1.45,
                  fontStyle: isDeletedMsg ? 'italic' : 'normal',
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
      <div className="flex gap-2 px-3 py-2.5 bg-white flex-shrink-0" style={{ borderTop: '1px solid rgba(61,140,120,0.1)' }}>
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

// ── Chat List View ──
function ChatList() {
  const navigate = useNavigate();
  const { unreadChats } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/chat/conversations');
      setConversations(res.data || res || []);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: '#d0ece5', borderTopColor: '#3d8c78' }} />
          <p className="text-gray-500 text-sm font-semibold">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>No chats yet</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Chats will appear here when you or a volunteer starts a conversation on an accepted report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #e8d9cc' }}>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: 'var(--text-dark)' }}>
          My Chats
        </h1>
      </div>

      <div className="divide-y" style={{ borderColor: '#f0ebe6' }}>
        {conversations.map((conv) => {
          const unread = unreadChats[conv.reportId]?.count || conv.unreadCount || 0;
          return (
            <button key={conv.reportId}
              onClick={() => navigate(`/chat/${conv.reportId}`, { state: { contactName: conv.otherUser?.name || 'Chat' } })}
              className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
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
        })}
      </div>
    </div>
  );
}

// ── Main ChatPage ──
export default function ChatPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const contactName = location.state?.contactName || '';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-gradient)' }}>
        <div className="card p-10 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Fredoka', cursive", color: 'var(--text-dark)' }}>
            My Chats
          </h1>
          <p className="text-gray-500 mb-6">Please sign in to view your chats.</p>
          <button onClick={() => navigate('/login')} className="w-full btn-primary mb-3">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)', background: 'var(--bg-gradient)' }}>
      <Helmet>
        <title>{reportId ? (contactName || 'Chat') : 'My Chats'} | OurPetCare</title>
      </Helmet>

      {reportId ? (
        <ChatConversation
          reportId={reportId}
          contactName={contactName}
          onBack={() => navigate('/chat')}
        />
      ) : (
        <ChatList />
      )}
    </div>
  );
}
