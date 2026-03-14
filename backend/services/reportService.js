/**
 * Report service - business logic for reports
 */

const Animal = require("../models/Animal");
const Report = require("../models/Report");
const Zone = require("../models/Zone");
const riskService = require("./riskService");
const AppError = require("../utils/AppError");

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
      coordinates: data.location.coordinates,
    },
  });

  const report = await Report.create({
    ...data,
    animal: animal._id,
    zone: zone.name,
    reportedBy: userId,
    status: "pending",
  });

  await riskService.recalculateAllZones();
  return report.populate(["animal", "reportedBy", "zone"]);
};

const getReportsByZone = async (zone, currentUser) => {
  const query = zone ? { zone } : {};

  const reports = await Report.find(query)
    .populate("animal")
    .populate("reportedBy", "name email phone")
    .populate("acceptedBy", "name email")
    .sort({ createdAt: -1 });

  return reports.map((report) => {
    const reportObj = report.toObject();

    const isAdmin = currentUser.role === "admin";

    const isAssignedVolunteer =
      report.status === "accepted" &&
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
    .populate("animal")
    .populate("reportedBy", "name email phone role")
    .populate("acceptedBy", "name email");
  if (!report) {
    throw new AppError("Report not found", 404);
  }
  return report;
};

const acceptReport = async (reportId, userId) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new AppError("Report not found", 404);
  }
  if (report.status !== "pending") {
    throw new AppError(
      `Report cannot be accepted - current status: ${report.status}`,
      400,
    );
  }

  report.status = "accepted";
  report.acceptedBy = userId;
  await report.save();
  return report.populate(["animal", "reportedBy", "acceptedBy"]);
};

const resolveReport = async (reportId, user) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.status === "resolved") {
    throw new AppError("Report is already resolved", 400);
  }

  const isAdmin = user.role === "admin";
  const isAssigned =
    report.acceptedBy && report.acceptedBy.toString() === user._id.toString();
  const isReporter =
    report.reportedBy && report.reportedBy.toString() === user._id.toString();

  if (!isAdmin && !isAssigned && !isReporter) {
    throw new AppError("Not authorized to resolve this report", 403);
  }

  // Volunteers (assigned) must have the report in accepted status
  // Reporters and admins can resolve from any non-resolved status
  if (!isAdmin && !isReporter && report.status !== "accepted") {
    throw new AppError("Only accepted reports can be resolved by volunteers", 400);
  }

  report.status = "resolved";
  await report.save();

  // Update linked Animal based on what was resolved
  if (report.animal) {
    const animalUpdate = { condition: "healthy" };
    if (report.condition === "vaccination-needed") {
      animalUpdate.vaccinationStatus = "up-to-date";
    }
    await Animal.findByIdAndUpdate(report.animal, animalUpdate);
  }

  return report;
};
const unassignReport = async (reportId, user) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.status !== "accepted") {
    throw new AppError("Only accepted reports can be unassigned", 400);
  }

  const isAssigned =
    report.acceptedBy && report.acceptedBy.toString() === user._id.toString();

  if (!isAssigned) {
    throw new AppError("Not authorized to unassign this report", 403);
  }

  report.status = "pending";
  report.acceptedBy = undefined;

  await report.save();

  return report;
};

const updateReport = async (reportId, userId, data) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new AppError("Report not found", 404);
  }

  // Only allow editing if user is the owner
  if (report.reportedBy.toString() !== userId.toString()) {
    throw new AppError("Not authorized to update this report", 403);
  }

  // Only allow editing if report is pending
  if (report.status !== "pending") {
    throw new AppError("Can only edit pending reports", 400);
  }

  // Update allowed fields
  const allowedFields = ["condition", "zone", "description", "photo"];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      report[field] = data[field];
    }
  });

  await report.save();
  return report.populate(["animal", "reportedBy", "acceptedBy"]);
};

const deleteReport = async (reportId, userId) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new AppError("Report not found", 404);
  }

  // Only allow deletion if user is the owner
  if (report.reportedBy.toString() !== userId.toString()) {
    throw new AppError("Not authorized to delete this report", 403);
  }

  // Only allow deletion if report is pending
  if (report.status !== "pending") {
    throw new AppError("Can only delete pending reports", 400);
  }

  await Report.findByIdAndDelete(reportId);
  return { message: "Report deleted successfully" };
};

const getAdoptionAnimals = async () => {
  const animals = await Report.find({ condition: "for-adoption", status: { $ne: "resolved" } })
    .populate("animal")
    .populate("reportedBy", "name email phone")
    .sort({ createdAt: -1 });

  return animals;
};
module.exports = {
  createReport,
  getReportsByZone,
  getReportById,
  acceptReport,
  resolveReport,
  unassignReport,
  updateReport,
  deleteReport,
  getAdoptionAnimals,
};
