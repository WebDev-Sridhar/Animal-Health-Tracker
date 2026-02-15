/**
 * Zone model for risk tracking
 */

const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

zoneSchema.index({ riskScore: -1 });
zoneSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Zone', zoneSchema);
