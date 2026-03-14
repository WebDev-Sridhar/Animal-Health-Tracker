const express = require('express');
const mongoose = require('mongoose');
const ChatMessage = require('../models/ChatMessage');
const Report = require('../models/Report');

const router = express.Router();

// GET /api/chat/conversations — list all conversations for the current user
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user._id;

    // Find reports where user is reporter or accepted volunteer
    const reports = await Report.find({
      $or: [{ reportedBy: userId }, { acceptedBy: userId }],
      acceptedBy: { $exists: true, $ne: null },
    })
      .select('reportedBy acceptedBy animal zone status')
      .populate('reportedBy', 'name')
      .populate('acceptedBy', 'name')
      .populate('animal', 'species')
      .lean();

    if (reports.length === 0) {
      return res.json([]);
    }

    const reportIds = reports.map((r) => r._id);

    // Aggregate last message + unread count per report, excluding messages deleted for this user
    const msgAgg = await ChatMessage.aggregate([
      {
        $match: {
          reportId: { $in: reportIds },
          deletedFor: { $nin: [userId] },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$reportId',
          lastMessage: { $first: { $cond: [{ $eq: ['$isDeleted', true] }, 'This message was deleted', '$text'] } },
          lastSenderName: { $first: '$senderName' },
          lastMessageTime: { $first: '$createdAt' },
          totalMessages: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $not: { $in: [userId, '$readBy'] } },
                  { $ne: ['$senderId', userId] },
                ] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const msgMap = {};
    for (const m of msgAgg) {
      msgMap[m._id.toString()] = m;
    }

    const conversations = reports
      .map((r) => {
        const rid = r._id.toString();
        const msg = msgMap[rid] || {};
        const isReporter =
          r.reportedBy?._id?.toString() === userId.toString();
        const otherUser = isReporter ? r.acceptedBy : r.reportedBy;

        return {
          reportId: rid,
          otherUser: otherUser
            ? { _id: otherUser._id, name: otherUser.name }
            : null,
          lastMessage: msg.lastMessage || null,
          lastSenderName: msg.lastSenderName || null,
          lastMessageTime: msg.lastMessageTime || null,
          unreadCount: msg.unreadCount || 0,
          totalMessages: msg.totalMessages || 0,
          reportSpecies: r.animal?.species || 'Animal',
          reportZone: r.zone || '',
          reportStatus: r.status,
        };
      })
      // Only show conversations that have visible messages or are accepted
      .filter((c) => c.totalMessages > 0 || c.reportStatus === 'accepted')
      .sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
      );

    res.json(conversations);
  } catch (err) {
    console.error('[Chat API] conversations error:', err.message);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

// GET /api/chat/unread — unread counts grouped by reportId
router.get('/unread', async (req, res) => {
  try {
    const userId = req.user._id;

    // Find reports where user is a participant
    const reports = await Report.find({
      $or: [{ reportedBy: userId }, { acceptedBy: userId }],
      acceptedBy: { $exists: true, $ne: null },
    })
      .select('_id')
      .lean();

    const reportIds = reports.map((r) => r._id);

    if (reportIds.length === 0) {
      return res.json({});
    }

    const agg = await ChatMessage.aggregate([
      {
        $match: {
          reportId: { $in: reportIds },
          readBy: { $nin: [userId] },
          senderId: { $ne: userId },
          deletedFor: { $nin: [userId] },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$reportId',
          count: { $sum: 1 },
          senderName: { $first: '$senderName' },
          lastMessage: { $first: '$text' },
        },
      },
    ]);

    const result = {};
    for (const item of agg) {
      result[item._id.toString()] = {
        count: item.count,
        senderName: item.senderName,
        lastMessage: item.lastMessage,
      };
    }

    res.json(result);
  } catch (err) {
    console.error('[Chat API] unread error:', err.message);
    res.status(500).json({ error: 'Failed to load unread counts' });
  }
});

// PATCH /api/chat/:reportId/read — mark all messages as read
router.patch('/:reportId/read', async (req, res) => {
  try {
    const { reportId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }

    await ChatMessage.updateMany(
      { reportId, readBy: { $nin: [req.user._id] } },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[Chat API] mark read error:', err.message);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// DELETE /api/chat/:reportId — Delete chat
// 1) Replace text of user's own sent messages with "This message was deleted" + set isDeleted=true
// 2) Add userId to deletedFor on ALL messages (hides entire chat for this user)
router.delete('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }

    const report = await Report.findById(reportId)
      .select('reportedBy acceptedBy')
      .lean();
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const userId = req.user._id;
    const isParticipant =
      report.reportedBy?.toString() === userId.toString() ||
      report.acceptedBy?.toString() === userId.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this chat' });
    }

    // Step 1: Mark user's own sent messages as deleted (other user sees "This message was deleted")
    await ChatMessage.updateMany(
      { reportId, senderId: userId },
      { $set: { text: 'This message was deleted', isDeleted: true } }
    );

    // Step 2: Hide all messages from this user's view
    await ChatMessage.updateMany(
      { reportId },
      { $addToSet: { deletedFor: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[Chat API] delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// DELETE /api/chat/:reportId/clear — Clear chat (per-user soft delete)
// Adds userId to deletedFor on all messages; other user still sees everything
router.delete('/:reportId/clear', async (req, res) => {
  try {
    const { reportId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }

    const report = await Report.findById(reportId)
      .select('reportedBy acceptedBy')
      .lean();
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const userId = req.user._id;
    const isParticipant =
      report.reportedBy?.toString() === userId.toString() ||
      report.acceptedBy?.toString() === userId.toString();

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this chat' });
    }

    // Soft-delete: hide all messages for this user only
    await ChatMessage.updateMany(
      { reportId },
      { $addToSet: { deletedFor: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[Chat API] clear error:', err.message);
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

module.exports = router;
