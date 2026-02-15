/**
 * Report routes
 * Role-based: public+ can create; volunteer+ can view/accept/resolve
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authorize } = require('../middleware/auth');
const { uploadReportPhoto } = require('../middleware/upload');

// volunteer and admin can view reports, accept, resolve
const volunteerOrAdmin = authorize('volunteer', 'admin');

router.route('/')
  .get(volunteerOrAdmin, reportController.getReports)
  .post(uploadReportPhoto, reportController.createReport);

router.get('/:id', volunteerOrAdmin, reportController.getReport);
router.patch('/:id/accept', volunteerOrAdmin, reportController.acceptReport);
router.patch('/:id/resolve', volunteerOrAdmin, reportController.resolveReport);
router.patch('/:id/unassign', volunteerOrAdmin, reportController.unassignReport);

module.exports = router;
