/**
 * Real-time chat handler.
 * Uses Socket.IO rooms keyed by reportId so only participants in that
 * report's conversation receive messages.
 */

const ChatMessage = require('../../models/ChatMessage');
const { authenticatedSockets, messageCounts } = require('../state');
const { checkRateLimit, isValidObjectId } = require('../utils');

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
function registerChatHandlers(socket, io) {
  // Join a report's chat room and receive message history
  socket.on('joinChatRoom', async ({ reportId } = {}) => {
    const session = authenticatedSockets.get(socket.id);
    if (!session) return; // Must be authenticated

    if (!isValidObjectId(reportId)) {
      socket.emit('chatError', { message: 'Invalid report ID' });
      return;
    }

    socket.join(reportId);

    try {
      // Send last 50 messages in chronological order
      const history = await ChatMessage.find({ reportId })
        .sort({ createdAt: 1 })
        .limit(50)
        .lean();

      socket.emit('messageHistory', history);
    } catch (err) {
      console.error('[Chat] Failed to load history:', err.message);
    }
  });

  // Receive and broadcast a new message
  socket.on('sendMessage', async ({ reportId, text } = {}) => {
    const session = authenticatedSockets.get(socket.id);
    if (!session) return;

    if (!isValidObjectId(reportId)) return;

    // Sanitise text
    const trimmed = String(text || '').trim();
    if (!trimmed || trimmed.length > 1000) return;

    // Rate limit: 20 messages per 60 seconds per user
    if (!checkRateLimit(session.userId, messageCounts)) {
      socket.emit('rateLimit', { message: 'Too many messages. Please slow down.' });
      return;
    }

    try {
      const msg = await ChatMessage.create({
        reportId,
        senderId: session.userId,
        senderName: session.name,
        senderRole: session.role,
        text: trimmed,
        readBy: [session.userId], // sender has already "read" it
      });

      // Broadcast to everyone in this report's room (including sender)
      io.to(reportId).emit('newMessage', {
        _id: msg._id.toString(),
        reportId: msg.reportId.toString(),
        senderId: msg.senderId.toString(),
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        text: msg.text,
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error('[Chat] Failed to save message:', err.message);
    }
  });

  // Leave a room (cleanup when chat window closes)
  socket.on('leaveChatRoom', ({ reportId } = {}) => {
    if (isValidObjectId(reportId)) {
      socket.leave(reportId);
    }
  });
}

module.exports = { registerChatHandlers };
