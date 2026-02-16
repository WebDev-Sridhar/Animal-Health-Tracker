/**
 * Animal model for health tracking with GeoJSON support
 */

const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  dateGiven: {
    type: Date,
    required: true,
  },
  validUntil: Date,
  administeredBy: {
    type: String,
    trim: true,
  },
}, { _id: true });

const animalSchema = new mongoose.Schema({
  species: {
    type: String,
    required: [true, 'Species is required'],
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  approxAge: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    enum: ['healthy', 'sick', 'critical', 'aggressive', 'injured', 'vaccination-needed', 'for-adoption'],
    default: 'healthy',
  },
  vaccinationStatus: {
    type: String,
    enum: ['up-to-date', 'unknown', 'not-vaccinated'],
    default: 'unknown',
  },
  vaccinations: [vaccinationSchema],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 2 && v.every(n => typeof n === 'number');
        },
        message: 'Coordinates must be [longitude, latitude]',
      },
    },
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  zone: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// 2dsphere index for geo queries (e.g. $near, $geoWithin)
animalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Animal', animalSchema);
