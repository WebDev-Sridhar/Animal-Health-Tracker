/**
 * Analytics service - aggregates data for admin dashboard
 */

const Animal = require("../models/Animal");
const Report = require("../models/Report");
const Zone = require("../models/Zone");

const getAnalytics = async () => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);

  const [
    totalAnimals,
    sickAnimals,
    vaccinatedAnimals,
    reportsThisWeek,
    healthBreakdown,
    zones,
  ] = await Promise.all([
    Animal.countDocuments(),
    Animal.countDocuments({ condition: { $in: ["sick", "critical"] } }),
    Animal.countDocuments({
      vaccinationStatus: { $in: ["partial", "complete"] },
    }),
    Report.countDocuments({ createdAt: { $gte: weekStart } }),
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
    reportsThisWeek,
    healthBreakdown: healthBreakdown.reduce((acc, { _id, count }) => {
      acc[_id || "unknown"] = count;
      return acc;
    }, {}),
    zones: zones.map((z) => ({ name: z.name, riskScore: z.riskScore })),
  };
};

module.exports = { getAnalytics };
