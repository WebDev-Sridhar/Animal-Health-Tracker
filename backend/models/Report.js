/**
 * Report model for animal sighting/condition reports
 */

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  condition: {
    type: String,
    enum: ['injured', 'sick', 'aggressive', 'vaccination_needed'],
    required: [true, 'Condition is required'],
  },
  photo: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'resolved'],
    default: 'pending',
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  zone: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: undefined,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

reportSchema.index({ zone: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Report', reportSchema);
