/**
 * useChat — encapsulates all chat socket logic for a given reportId.
 * Join the room on mount, leave on unmount, and expose messages + sendMessage.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export function useChat(reportId) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!reportId || !socket) return;

    // Join the room and request history
    socket.emit('joinChatRoom', { reportId });

    const onHistory = (history) => {
      setMessages(history);
      setUnreadCount(0);
    };

    const onNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      // Only count as unread if it came from someone else
      if (msg.senderId !== user?.id) {
        setUnreadCount((c) => c + 1);
      }
    };

    socket.on('messageHistory', onHistory);
    socket.on('newMessage', onNewMessage);

    return () => {
      socket.emit('leaveChatRoom', { reportId });
      socket.off('messageHistory', onHistory);
      socket.off('newMessage', onNewMessage);
    };
  }, [reportId, socket, user?.id]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = String(text || '').trim();
      if (!trimmed || !reportId) return;
      socket.emit('sendMessage', { reportId, text: trimmed });
    },
    [socket, reportId]
  );

  // Reset unread when the chat window is opened/focused
  const markRead = useCallback(() => setUnreadCount(0), []);

  return { messages, sendMessage, unreadCount, markRead };
}
