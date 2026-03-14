/**
 * Emergency alert handler.
 * Called from reportService.js after a report is saved.
 * Emits 'animalEmergency' to nearby volunteers (50km radius),
 * or to ALL online volunteers if the report has no GPS coordinates.
 */

const { getVolunteersNearby } = require('../utils');

const EMERGENCY_CONDITIONS = ['sick', 'critical', 'injured', 'aggressive'];
const ALERT_RADIUS_KM = 50; // Increased from 5km — enough for any realistic zone

/**
 * @param {import('socket.io').Server} io
 * @param {object} report - Mongoose Report document
 * @param {Map} volunteerLocations - Shared in-memory locations Map
 */
function emitEmergencyAlert(io, report, volunteerLocations) {
  if (!EMERGENCY_CONDITIONS.includes(report.condition)) return;

  if (volunteerLocations.size === 0) {
    console.log('[Emergency] No online volunteers to alert.');
    return;
  }

  // GeoJSON stores [longitude, latitude] — flip to [lat, lng] for haversine
  const coords = report.location && report.location.coordinates;
  const hasGPS = coords && coords.length === 2;

  let targets;
  let lat = null;
  let lng = null;

  if (hasGPS) {
    lat = coords[1];
    lng = coords[0];
    // Filter to volunteers within 50km
    targets = getVolunteersNearby(lat, lng, volunteerLocations, ALERT_RADIUS_KM);
    if (targets.length === 0) {
      // No one nearby — fall back to alerting all online volunteers
      targets = [...volunteerLocations.values()].map((v) => ({ ...v, distanceKm: null }));
      console.log('[Emergency] No volunteers within 50km — alerting all online volunteers');
    }
  } else {
    // No GPS on report — alert everyone online
    targets = [...volunteerLocations.values()].map((v) => ({ ...v, distanceKm: null }));
    console.log('[Emergency] No GPS on report — alerting all online volunteers');
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

  for (const vol of targets) {
    io.to(vol.socketId).emit('animalEmergency', {
      ...payload,
      distanceKm: vol.distanceKm,
    });
  }

  console.log(
    `[Emergency] Alerted ${targets.length} volunteer(s) for ${report.condition} report (${hasGPS ? `GPS: ${lat},${lng}` : 'no GPS'})`
  );
}

module.exports = { emitEmergencyAlert };
