/**
 * Risk controller - admin endpoints for risk recalculation
 */

const riskService = require('../services/risk.service');

const AppError = require('../utils/AppError');

const recalculateRisk = async (req, res, next) => {
  try {
    const { radiusMeters, daysBack } = req.query;
    const options = {};
    if (radiusMeters) {
      const val = parseInt(radiusMeters, 10);
      if (Number.isNaN(val) || val <= 0) return next(new AppError('radiusMeters must be a positive number', 400));
      options.radiusMeters = val;
    }
    if (daysBack) {
      const val = parseInt(daysBack, 10);
      if (Number.isNaN(val) || val <= 0) return next(new AppError('daysBack must be a positive number', 400));
      options.daysBack = val;
    }

    const results = await riskService.recalculateAllZones(options);
    res.status(200).json({
      success: true,
      message: 'Risk recalculation completed',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

const getZoneRisks = async (req, res, next) => {
  try {
    const zones = await riskService.getZoneRisks();
    res.status(200).json({
      success: true,
      count: zones.length,
      data: zones,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recalculateRisk,
  getZoneRisks,
};
