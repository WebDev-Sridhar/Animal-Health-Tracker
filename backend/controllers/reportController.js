/**
 * Report controller - handles HTTP requests for reports
 */

const reportService = require('../services/reportService');

const createReport = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.location === 'string') {
      try {
        body.location = JSON.parse(body.location);
      } catch {
        body.location = undefined;
      }
    }
    const report = await reportService.createReport(body, req.user._id);
    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { zone } = req.query;
    const reports = await reportService.getReportsByZone(zone, req.user);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

const acceptReport = async (req, res, next) => {
  try {
    const report = await reportService.acceptReport(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: report,
      message: 'Report accepted',
    });
  } catch (error) {
    next(error);
  }
};

const resolveReport = async (req, res, next) => {
  try {
    const report = await reportService.resolveReport(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      data: report,
      message: 'Report marked as resolved',
    });
  } catch (error) {
    next(error);
  }
};

const unassignReport = async (req, res, next) => {
  try {
    const report = await reportService.unassignReport(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      data: report,
      message: 'Report returned to pending',
    });
  } catch (error) {
    next(error);
  }
};

const getAdoptionAnimals = async (req, res) => {
  try {
    const animals = await Report.find({ condition: 'for-adoption' })
      .populate('animal')
      .populate('reportedBy')
      .populate('zone')
      .sort({ createdAt: -1 });

    res.status(200).json(animals);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch adoption animals',
      error: error.message
    });
  }
};

module.exports = {
  createReport,
  getReports,
  getReport,
  getAdoptionAnimals,
  acceptReport,
  unassignReport,
  resolveReport,
};
