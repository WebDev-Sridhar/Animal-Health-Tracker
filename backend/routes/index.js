/**
 * Main routes aggregator
 */

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const animalRoutes = require('./animalRoutes');
const reportRoutes = require('./reportRoutes');
const riskRoutes = require('./riskRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/animals', animalRoutes);
router.use('/reports', protect, reportRoutes);
router.use('/risk', protect, riskRoutes);
router.use('/analytics', protect, analyticsRoutes);

// Health check
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Animal Health Tracker API is running',
  });
});

module.exports = router;
