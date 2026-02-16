/**
 * Report service - business logic for reports
 */

const Animal = require('../models/Animal');
const Report = require('../models/Report');
const Zone = require('../models/Zone');
const riskService = require('./riskService');
const AppError = require('../utils/AppError');



  
const createReport = async (data, userId) => {

  let zone = await Zone.findOne({ name: data.zone });

if (!zone) {
  zone = await Zone.create({ name: data.zone });
}
  
  const animal = await Animal.create({
  species: data.species,
  gender: data.gender,
  approxAge: data.approxAge,
  condition: data.condition,
  vaccinationStatus: data.vaccinationStatus,
  zone: data.zone,
  location: {
    type: "Point",
    coordinates: data.location.coordinates
  }
});
  
  const report = await Report.create({
    ...data,
    animal: animal._id,
    zone: zone.name,
    reportedBy: userId,
    status: 'pending',
  });

    await riskService.recalculateAllZones();
  return report.populate(['animal', 'reportedBy', 'zone']);
};

const getReportsByZone = async (zone, currentUser) => {
  const query = zone ? { zone } : {};

  const reports = await Report.find(query)
    .populate('animal')
    .populate('reportedBy', 'name email phone')
    .populate('acceptedBy', 'name email')
    .sort({ createdAt: -1 });

  return reports.map((report) => {
    const reportObj = report.toObject();

    const isAdmin = currentUser.role === 'admin';

    const isAssignedVolunteer =
      report.status === 'accepted' &&
      report.acceptedBy &&
      report.acceptedBy._id.toString() === currentUser._id.toString();

    if (!isAdmin && !isAssignedVolunteer) {
      delete reportObj.reportedBy;
    }

    return reportObj;
  });
};

const getReportById = async (id) => {
  const report = await Report.findById(id)
    .populate('animal')
    .populate('reportedBy', 'name email role')
    .populate('acceptedBy', 'name email');
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  return report;
};

const acceptReport = async (reportId, userId) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new AppError('Report not found', 404);
  }
  if (report.status !== 'pending') {
    throw new AppError(`Report cannot be accepted - current status: ${report.status}`, 400);
  }

  report.status = 'accepted';
  report.acceptedBy = userId;
  await report.save();
  return report.populate(['animal', 'reportedBy', 'acceptedBy']);
};

const resolveReport = async (reportId, user) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  if (report.status !== 'accepted') {
    throw new AppError('Only accepted reports can be resolved', 400);
  }

  const isAdmin = user.role === 'admin';
  const isAssigned =
    report.acceptedBy &&
    report.acceptedBy.toString() === user._id.toString();

  if (!isAdmin && !isAssigned) {
    throw new AppError('Not authorized to resolve this report', 403);
  }

  report.status = 'resolved';
  await report.save();

  return report;
};
const unassignReport = async (reportId, user) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  if (report.status !== 'accepted') {
    throw new AppError('Only accepted reports can be unassigned', 400);
  }

  const isAssigned =
    report.acceptedBy &&
    report.acceptedBy.toString() === user._id.toString();

  if (!isAssigned) {
    throw new AppError('Not authorized to unassign this report', 403);
  }

  report.status = 'pending';
  report.acceptedBy = undefined;

  await report.save();

  return report;
};
module.exports = {
  createReport,
  getReportsByZone,
  getReportById,
  acceptReport,
  resolveReport,
  unassignReport,
};
