/**
 * ChatWidget — fixed chat panel for reporter ↔ volunteer conversation.
 * Opened from the reporter's Account page when a report is in "accepted" status.
 *
 * Props:
 *   reportId      {string}   MongoDB report _id
 *   volunteerName {string}   Name to show in the header
 *   isOpen        {boolean}
 *   onClose       {function}
 */

import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget({ reportId, volunteerName, isOpen, onClose }) {
  const { user } = useAuth();
  const { markChatRead } = useSocket();
  const { messages, sendMessage, unreadCount, markRead } = useChat(isOpen ? reportId : null);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when opened
  useEffect(() => {
    if (isOpen) {
      markRead();
      markChatRead(reportId);
    }
  }, [isOpen, markRead, markChatRead, reportId, messages.length]);

  if (!isOpen) return null;

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 340,
        maxHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        background: 'var(--card-bg)',
        zIndex: 1000,
        overflow: 'hidden',
        border: '1px solid rgba(61,140,120,0.15)',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
          color: '#fff',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontFamily: "'Fredoka', cursive", fontSize: 16 }}>
            {volunteerName || 'Chat'}
          </p>
          <p style={{ margin: 0, fontSize: 11, opacity: 0.8 }}>Volunteer chat</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 28,
            height: 28,
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: '#f9fbfa',
          minHeight: 280,
          maxHeight: 360,
        }}
      >
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 40 }}>
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div
              key={msg._id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start',
              }}
            >
              {!isOwn && (
                <span style={{ fontSize: 10, color: '#6b8075', marginBottom: 2, fontWeight: 600 }}>
                  {msg.senderName}
                </span>
              )}
              <div
                style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isOwn
                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                    : '#fff',
                  color: isOwn ? '#fff' : '#1e3d30',
                  fontSize: 13,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
              <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: '1px solid rgba(61,140,120,0.1)',
          display: 'flex',
          gap: 8,
          background: '#fff',
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: '1.5px solid rgba(61,140,120,0.25)',
            borderRadius: 'var(--radius)',
            padding: '8px 10px',
            fontSize: 13,
            fontFamily: 'inherit',
            outline: 'none',
            lineHeight: 1.4,
          }}
          onFocus={(e) =>
            (e.target.style.border = '1.5px solid var(--primary)')
          }
          onBlur={(e) =>
            (e.target.style.border = '1.5px solid rgba(61,140,120,0.25)')
          }
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: 13, minWidth: 'auto', flexShrink: 0 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
