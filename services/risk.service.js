/**
 * Risk analysis service
 * Modular logic for zone risk scoring based on sick/critical animals
 */

const Animal = require('../models/Animal');
const Zone = require('../models/Zone');

// Configurable thresholds
const DEFAULT_RADIUS_KM = 1;
const DEFAULT_DAYS_BACK = 7;
const HIGH_RISK_THRESHOLD = 5;
const MAX_RISK_SCORE = 100;

const EARTH_RADIUS_METERS = 6378100;

/**
 * Count sick or critical animals within radius of a point (last N days)
 * Uses $geoWithin for filtering (no $or conflict with geo queries)
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} radiusMeters - Radius in meters
 * @param {number} daysBack - Days to look back
 * @returns {Promise<number>}
 */
const countSickCriticalInRadius = async (lng, lat, radiusMeters, daysBack) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  const radiusRadians = radiusMeters / EARTH_RADIUS_METERS;

  const count = await Animal.countDocuments({
    healthStatus: { $in: ['sick', 'critical'] },
    'location.coordinates': { $exists: true, $ne: [] },
    $or: [
      { createdAt: { $gte: cutoffDate } },
      { updatedAt: { $gte: cutoffDate } },
    ],
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusRadians],
      },
    },
  });

  return count;
};

/**
 * Map sick/critical count to risk score (0-100)
 * 5+ = high risk (100)
 * @param {number} count - Number of sick/critical animals in cluster
 * @returns {number}
 */
const calculateRiskScore = (count) => {
  if (count >= HIGH_RISK_THRESHOLD) return MAX_RISK_SCORE;
  return Math.round((count / HIGH_RISK_THRESHOLD) * MAX_RISK_SCORE);
};

/**
 * Find zones with high-risk clusters (5+ sick/critical within 1km in last 7 days)
 * Returns map of zoneName -> max count in any 1km radius
 * @param {number} radiusMeters
 * @param {number} daysBack
 * @returns {Promise<Map<string, number>>}
 */
const findZoneRiskCounts = async (radiusMeters = DEFAULT_RADIUS_KM * 1000, daysBack = DEFAULT_DAYS_BACK) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  const sickAnimals = await Animal.find({
    healthStatus: { $in: ['sick', 'critical'] },
    'location.coordinates.0': { $exists: true },
    'location.coordinates.1': { $exists: true },
    zone: { $exists: true, $ne: '' },
    $or: [
      { createdAt: { $gte: cutoffDate } },
      { updatedAt: { $gte: cutoffDate } },
    ],
  }).lean();

  const zoneMaxCounts = new Map();

  for (const animal of sickAnimals) {
    const [lng, lat] = animal.location.coordinates;
    const count = await countSickCriticalInRadius(lng, lat, radiusMeters, daysBack);
    const zone = animal.zone?.trim() || 'Unknown';

    const current = zoneMaxCounts.get(zone) ?? 0;
    if (count > current) {
      zoneMaxCounts.set(zone, count);
    }
  }

  return zoneMaxCounts;
};

/**
 * Recalculate and persist risk scores for all zones
 * @param {Object} options
 * @param {number} options.radiusMeters - Radius in meters (default 1000)
 * @param {number} options.daysBack - Days to look back (default 7)
 * @returns {Promise<Array<{zone: string, riskScore: number}>>}
 */
const recalculateAllZones = async (options = {}) => {
  const radiusMeters = options.radiusMeters ?? DEFAULT_RADIUS_KM * 1000;
  const daysBack = options.daysBack ?? DEFAULT_DAYS_BACK;

  const zoneMaxCounts = await findZoneRiskCounts(radiusMeters, daysBack);

  const results = [];

  for (const [zoneName, count] of zoneMaxCounts) {
    const riskScore = calculateRiskScore(count);
    await Zone.findOneAndUpdate(
      { name: zoneName },
      { riskScore, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    results.push({ zone: zoneName, riskScore });
  }

  // Reset zones not in this run (no sick/critical recently) to 0
  const updatedZones = new Set(zoneMaxCounts.keys());
  await Zone.updateMany(
    { name: { $nin: [...updatedZones] } },
    { riskScore: 0, updatedAt: new Date() }
  );

  return results;
};

/**
 * Get current zone risk data
 * @returns {Promise<Array>}
 */
const getZoneRisks = async () => {
  return Zone.find().sort({ riskScore: -1 }).lean();
};

module.exports = {
  countSickCriticalInRadius,
  calculateRiskScore,
  findZoneRiskCounts,
  recalculateAllZones,
  getZoneRisks,
  HIGH_RISK_THRESHOLD,
  DEFAULT_RADIUS_KM,
  DEFAULT_DAYS_BACK,
};
