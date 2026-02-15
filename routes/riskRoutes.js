/**
 * Risk routes - admin only
 */

const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');
const { authorize } = require('../middleware/auth');

const adminOnly = authorize('admin');

router.post('/recalculate', adminOnly, riskController.recalculateRisk);
router.get('/zones', adminOnly, riskController.getZoneRisks);

module.exports = router;
