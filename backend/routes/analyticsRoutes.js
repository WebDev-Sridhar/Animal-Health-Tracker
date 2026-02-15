/**
 * Analytics routes - admin only
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authorize } = require('../middleware/auth');

const adminOnly = authorize('admin');

router.get('/', adminOnly, analyticsController.getAnalytics);

module.exports = router;
