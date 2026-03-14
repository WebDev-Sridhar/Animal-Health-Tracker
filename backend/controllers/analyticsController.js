/**
 * Analytics controller - admin dashboard data
 */

const analyticsService = require('../services/analyticsService');

const getAnalytics = async (req, res, next) => {
  try {
    const { timeframe = "all" } = req.query;
    const data = await analyticsService.getAnalytics(timeframe);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
