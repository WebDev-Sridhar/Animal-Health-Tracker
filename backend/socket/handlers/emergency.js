/**
 * Emergency alert handler.
 * Called from reportService.js (not from a socket event) after a report is saved.
 * Finds volunteers within 5km and emits 'animalEmergency' to each.
 */

const { getVolunteersNearby } = require('../utils');

const EMERGENCY_CONDITIONS = ['sick', 'critical', 'injured', 'aggressive'];
const ALERT_RADIUS_KM = 5;

/**
 * Emit an emergency alert to all online volunteers within 5km of the report.
 *
 * @param {import('socket.io').Server} io
 * @param {object} report - Mongoose Report document
 * @param {Map} volunteerLocations - Shared in-memory locations Map
 */
function emitEmergencyAlert(io, report, volunteerLocations) {
  if (!EMERGENCY_CONDITIONS.includes(report.condition)) return;

  // GeoJSON stores [longitude, latitude] — flip to [lat, lng] for haversine
  const coords = report.location && report.location.coordinates;
  if (!coords || coords.length !== 2) return; // No GPS data, skip

  const lat = coords[1];
  const lng = coords[0];

  const nearby = getVolunteersNearby(lat, lng, volunteerLocations, ALERT_RADIUS_KM);

  if (nearby.length === 0) return;

  const payload = {
    reportId: report._id.toString(),
    condition: report.condition,
    species: report.species || 'Unknown animal',
    description: report.description || '',
    lat,
    lng,
    zone: report.zone || '',
  };

  for (const vol of nearby) {
    io.to(vol.socketId).emit('animalEmergency', {
      ...payload,
      distanceKm: vol.distanceKm,
    });
  }

  console.log(
    `[Emergency] Alerted ${nearby.length} volunteer(s) within ${ALERT_RADIUS_KM}km for ${report.condition} report`
  );
}

module.exports = { emitEmergencyAlert };
