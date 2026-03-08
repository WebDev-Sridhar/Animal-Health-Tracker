const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const { authorize } = require("../middleware/auth");
const { uploadReportPhoto } = require("../middleware/upload");

const volunteerOrAdmin = authorize("volunteer", "admin");

router
  .route("/")
  .get(reportController.getReports)
  .post(uploadReportPhoto, reportController.createReport);

router.get("/:id", reportController.getReport);
router.patch("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

// PROTECTED ROUTES
router.patch("/:id/accept", volunteerOrAdmin, reportController.acceptReport);
router.patch("/:id/resolve", volunteerOrAdmin, reportController.resolveReport);
router.patch(
  "/:id/unassign",
  volunteerOrAdmin,
  reportController.unassignReport,
);

module.exports = router;
