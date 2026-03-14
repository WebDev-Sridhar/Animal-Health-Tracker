/**
 * Analytics service - aggregates data for admin dashboard
 */

const Animal = require("../models/Animal");
const Report = require("../models/Report");
const Zone = require("../models/Zone");
const User = require("../models/User");

const RESCUE_CONDITIONS = ["sick", "critical", "injured", "aggressive"];
const ADOPTION_CONDITION = "for-adoption";
const VACCINATION_CONDITION = "vaccination-needed";

function getStartDate(timeframe) {
  const now = new Date();
  switch (timeframe) {
    case "week":    { const d = new Date(now); d.setDate(d.getDate() - 7);   d.setHours(0,0,0,0); return d; }
    case "month":   { const d = new Date(now); d.setDate(d.getDate() - 30);  d.setHours(0,0,0,0); return d; }
    case "3months": { const d = new Date(now); d.setDate(d.getDate() - 90);  d.setHours(0,0,0,0); return d; }
    case "year":    { const d = new Date(now); d.setDate(d.getDate() - 365); d.setHours(0,0,0,0); return d; }
    default:        return null; // all time
  }
}

function getTrendGroupFormat(timeframe) {
  // Returns MongoDB $dateToString format and number of expected data points
  switch (timeframe) {
    case "week":    return { fmt: "%Y-%m-%d", days: 7 };
    case "month":   return { fmt: "%Y-%m-%d", days: 30 };
    case "3months": return { fmt: "%Y-W%V", days: 13 }; // ISO weeks
    case "year":    return { fmt: "%Y-%m", days: 12 };
    default:        return { fmt: "%Y-%m", days: 12 };
  }
}

function conditionToCategory(condition) {
  if (condition === ADOPTION_CONDITION) return "adoption";
  if (condition === VACCINATION_CONDITION) return "vaccination";
  if (RESCUE_CONDITIONS.includes(condition)) return "rescue";
  return "other";
}

const getAnalytics = async (timeframe = "all") => {
  const startDate = getStartDate(timeframe);
  const matchBase = startDate ? { createdAt: { $gte: startDate } } : {};
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7); weekStart.setHours(0,0,0,0);

  // 1. Aggregate reports by condition + status (for categories table)
  const [categoryAgg, totalAnimals, zones, reportsThisWeek] = await Promise.all([
    Report.aggregate([
      { $match: matchBase },
      {
        $group: {
          _id: { condition: "$condition", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]),
    Animal.countDocuments(),
    Zone.find().sort({ riskScore: -1 }).lean(),
    Report.countDocuments({ createdAt: { $gte: weekStart } }),
  ]);

  // Build category breakdown from aggregation
  const empty = () => ({ submitted: 0, pending: 0, accepted: 0, resolved: 0 });
  const cats = { adoption: empty(), vaccination: empty(), rescue: empty() };
  let summary = { totalReports: 0, pendingReports: 0, acceptedReports: 0, resolvedReports: 0 };

  for (const { _id, count } of categoryAgg) {
    const cat = conditionToCategory(_id.condition);
    if (!cats[cat]) continue; // skip "healthy" / other
    cats[cat].submitted += count;
    if (_id.status === "pending")  { cats[cat].pending  += count; }
    if (_id.status === "accepted") { cats[cat].accepted += count; }
    if (_id.status === "resolved") { cats[cat].resolved += count; }
    summary.totalReports    += count;
    if (_id.status === "pending")  summary.pendingReports   += count;
    if (_id.status === "accepted") summary.acceptedReports  += count;
    if (_id.status === "resolved") summary.resolvedReports  += count;
  }
  summary.totalAnimals = totalAnimals;

  // 2. Trend data — group by date bucket per category
  const { fmt } = getTrendGroupFormat(timeframe);
  const trendAgg = await Report.aggregate([
    { $match: matchBase },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: fmt, date: "$createdAt" } },
          condition: "$condition",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  // Collect all unique dates
  const dateSet = new Set(trendAgg.map((r) => r._id.date));
  const sortedDates = [...dateSet].sort();

  const trendMap = {};
  for (const date of sortedDates) {
    trendMap[date] = { date, adoption: 0, vaccination: 0, rescue: 0, total: 0 };
  }
  for (const { _id, count } of trendAgg) {
    const cat = conditionToCategory(_id.condition);
    if (!trendMap[_id.date]) continue;
    if (cat === "adoption" || cat === "vaccination" || cat === "rescue") {
      trendMap[_id.date][cat] += count;
    }
    trendMap[_id.date].total += count;
  }
  const trend = Object.values(trendMap);

  return {
    timeframe,
    summary,
    categories: {
      adoption:    { label: "For Adoption",    emoji: "🏡", color: "#3b82f6", ...cats.adoption },
      vaccination: { label: "Vaccination",     emoji: "💉", color: "#06b6d4", ...cats.vaccination },
      rescue:      { label: "Animal Rescue",   emoji: "🚑", color: "#ef4444", ...cats.rescue },
    },
    trend,
    reportsThisWeek,
    zones: zones.map((z) => ({ name: z.name, riskScore: z.riskScore })),
  };
};

const getPublicStats = async () => {
  const [rescued, totalReports, adopted, volunteers] = await Promise.all([
    Report.countDocuments({ condition: { $in: RESCUE_CONDITIONS }, status: "resolved" }),
    Report.countDocuments(),
    Report.countDocuments({ condition: ADOPTION_CONDITION, status: "resolved" }),
    User.countDocuments({ role: "volunteer" }),
  ]);
  return { rescued, totalReports, adopted, volunteers };
};

module.exports = { getAnalytics, getPublicStats };
