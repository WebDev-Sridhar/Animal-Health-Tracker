/**
 * Main routes aggregator
 */

const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const animalRoutes = require("./animalRoutes");
const reportRoutes = require("./reportRoutes");
const riskRoutes = require("./riskRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const chatRoutes = require("./chatRoutes");
const { protect, authorize } = require("../middleware/auth");
const { getPublicStats } = require("../services/analyticsService");

// Public routes
router.use("/auth", authRoutes);

// Public stats endpoint (no auth required)
router.get("/stats", async (req, res) => {
  try {
    const stats = await getPublicStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Public adoptions endpoint (no auth required)
router.get(
  "/reports/adoptions",
  require("../controllers/reportController").getAdoptionAnimals,
);
// Public single report details endpoint (no auth required for viewing pet details)
router.get(
  "/reports/:id",
  require("../controllers/reportController").getReport,
);

// Protected routes (require authentication)
router.use("/animals", animalRoutes);
router.use("/reports", protect, reportRoutes);
router.use("/risk", protect, riskRoutes);
router.use("/analytics", protect, analyticsRoutes);
router.use("/chat", protect, chatRoutes);

// Health check
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Animal Health Tracker API is running",
  });
});

module.exports = router;
