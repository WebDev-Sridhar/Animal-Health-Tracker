const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatMessageSchema = new Schema(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderRole: {
      type: String,
      enum: ['public', 'volunteer', 'admin'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    // Tracks which users have read this message (for unread badge)
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Tracks which users have cleared/deleted this message from their view
    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // True when the sender's message content was replaced with "This message was deleted"
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Efficient room query: fetch messages for a report in chronological order
chatMessageSchema.index({ reportId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
