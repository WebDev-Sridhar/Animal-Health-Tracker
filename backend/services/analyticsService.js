/**
 * Analytics service - aggregates data for admin dashboard
 */

const Animal = require("../models/Animal");
const Report = require("../models/Report");
const Zone = require("../models/Zone");
const User = require("../models/User");

const getAnalytics = async () => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const [
    totalAnimals,
    sickAnimals,
    vaccinatedAnimals,
    vaccinationNeeded,
    forAdoption,
    rescuedAnimals,
    reportsThisWeek,
    totalReports,
    healthBreakdown,
    zones,
  ] = await Promise.all([
    Animal.countDocuments(),
    // sick + critical + injured
    Animal.countDocuments({ condition: { $in: ["sick", "critical", "injured"] } }),
    // only vaccination-needed reports that were resolved = vaccinated
    Report.countDocuments({ condition: "vaccination-needed", status: "resolved" }),
    // vaccination-needed reports still pending/accepted
    Report.countDocuments({ condition: "vaccination-needed", status: { $ne: "resolved" } }),
    // for-adoption reports not yet resolved
    Report.countDocuments({ condition: "for-adoption", status: { $ne: "resolved" } }),
    // sick/critical/injured/aggressive reports resolved = rescued
    Report.countDocuments({ condition: { $in: ["sick", "critical", "injured", "aggressive"] }, status: "resolved" }),
    Report.countDocuments({ createdAt: { $gte: weekStart } }),
    Report.countDocuments(),
    Animal.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Zone.find().sort({ riskScore: -1 }).lean(),
  ]);

  return {
    totalAnimals,
    sickAnimals,
    vaccinatedAnimals,
    vaccinationNeeded,
    forAdoption,
    rescuedAnimals,
    reportsThisWeek,
    totalReports,
    healthBreakdown: healthBreakdown.reduce((acc, { _id, count }) => {
      acc[_id || "unknown"] = count;
      return acc;
    }, {}),
    zones: zones.map((z) => ({ name: z.name, riskScore: z.riskScore })),
  };
};

const getPublicStats = async () => {
  const [rescued, totalReports, adopted, volunteers] = await Promise.all([
    Report.countDocuments({ condition: { $in: ["sick", "critical", "injured", "aggressive"] }, status: "resolved" }),
    Report.countDocuments(),
    Report.countDocuments({ condition: "for-adoption", status: "resolved" }),
    User.countDocuments({ role: "volunteer" }),
  ]);

  return { rescued, totalReports, adopted, volunteers };
};

module.exports = { getAnalytics, getPublicStats };
