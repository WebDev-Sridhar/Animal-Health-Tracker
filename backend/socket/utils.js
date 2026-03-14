/**
 * Pure utility functions for the Socket.IO layer.
 * No side effects — safe to import anywhere.
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine great-circle distance between two lat/lng points.
 * @returns {number} Distance in kilometres
 */
function haversineKm(lat1, lng1, lat2, lng2) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Simple sliding-window rate limiter (in-memory).
 * Allows up to MAX_MESSAGES per WINDOW_MS per userId.
 * @returns {boolean} true if the message is allowed, false if rate-limited
 */
const MAX_MESSAGES = 20;
const WINDOW_MS = 60 * 1000; // 60 seconds

function checkRateLimit(userId, messageCounts) {
  const now = Date.now();
  const entry = messageCounts.get(userId);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // First message in this window
    messageCounts.set(userId, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= MAX_MESSAGES) {
    return false; // Rate limited
  }

  entry.count += 1;
  return true;
}

/**
 * Returns all volunteers from the Map that are within radiusKm of [lat, lng].
 * @param {number} lat - Reference latitude
 * @param {number} lng - Reference longitude
 * @param {Map} volunteerLocations - The shared volunteer locations Map
 * @param {number} radiusKm - Search radius in km
 * @returns {Array} Array of location entries with an added `distanceKm` field
 */
function getVolunteersNearby(lat, lng, volunteerLocations, radiusKm) {
  const nearby = [];
  for (const vol of volunteerLocations.values()) {
    if (!vol.lat || !vol.lng) continue;
    const dist = haversineKm(lat, lng, vol.lat, vol.lng);
    if (dist <= radiusKm) {
      nearby.push({ ...vol, distanceKm: Math.round(dist * 10) / 10 });
    }
  }
  return nearby;
}

/**
 * Validates that a value is a finite number within [min, max].
 */
function isValidCoord(value, min, max) {
  return typeof value === 'number' && isFinite(value) && value >= min && value <= max;
}

/**
 * Validates a MongoDB ObjectId string (24 hex chars).
 */
function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(String(id));
}

module.exports = {
  haversineKm,
  checkRateLimit,
  getVolunteersNearby,
  isValidCoord,
  isValidObjectId,
};
