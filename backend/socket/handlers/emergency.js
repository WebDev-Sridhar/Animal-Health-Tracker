/**
 * Emergency alert handler.
 * Called from reportService.js after a report is saved.
 * Emits 'animalEmergency' to ALL authenticated online volunteers.
 * If the report has GPS coordinates, includes distance from each volunteer
 * who has shared their location. Volunteers who haven't shared location
 * still receive the alert — just without distance info.
 */

const { haversineKm } = require('../utils');
const { authenticatedSockets } = require('../state');

const EMERGENCY_CONDITIONS = ['sick', 'critical', 'injured', 'aggressive'];

/**
 * @param {import('socket.io').Server} io
 * @param {object} report - Mongoose Report document
 * @param {Map} volunteerLocations - Shared in-memory locations Map (for distance calc only)
 */
function emitEmergencyAlert(io, report, volunteerLocations) {
  if (!EMERGENCY_CONDITIONS.includes(report.condition)) return;

  // Build a map of all currently authenticated volunteers: userId → [socketId, ...]
  // This is the authoritative "who is online" source — does NOT require location sharing.
  const targets = new Map(); // userId → { socketIds: [], distanceKm: null }
  for (const [sid, sess] of authenticatedSockets.entries()) {
    if (sess.role !== 'volunteer') continue;
    if (!targets.has(sess.userId)) {
      targets.set(sess.userId, { socketIds: [], distanceKm: null });
    }
    targets.get(sess.userId).socketIds.push(sid);
  }

  if (targets.size === 0) {
    console.log('[Emergency] No authenticated volunteers online.');
    return;
  }

  // GPS handling — GeoJSON stores [longitude, latitude], flip to [lat, lng]
  const coords = report.location && report.location.coordinates;
  const hasGPS = coords && coords.length === 2;
  let lat = null;
  let lng = null;
  if (hasGPS) {
    lat = coords[1];
    lng = coords[0];
  }

  // For volunteers who have shared their location, compute distance to the report
  if (hasGPS) {
    for (const [userId, target] of targets.entries()) {
      const loc = volunteerLocations.get(userId);
      if (loc && loc.lat && loc.lng) {
        target.distanceKm = Math.round(haversineKm(lat, lng, loc.lat, loc.lng) * 10) / 10;
      }
    }
  }

  const payload = {
    reportId: report._id.toString(),
    condition: report.condition,
    species: report.species || 'Unknown animal',
    description: report.description || '',
    lat,
    lng,
    zone: report.zone || '',
  };

  let alertCount = 0;
  for (const { socketIds, distanceKm } of targets.values()) {
    for (const sid of socketIds) {
      io.to(sid).emit('animalEmergency', { ...payload, distanceKm });
      alertCount++;
    }
  }

  console.log(
    `[Emergency] Alerted ${alertCount} socket(s) across ${targets.size} volunteer(s) for ${report.condition} (${hasGPS ? `GPS: ${lat},${lng}` : 'no GPS'})`
  );
}

module.exports = { emitEmergencyAlert };
