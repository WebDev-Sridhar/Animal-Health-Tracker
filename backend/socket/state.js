/**
 * Shared in-memory state for the Socket.IO layer.
 * All Maps are module-level singletons — Node.js module caching ensures
 * every file that requires this module gets the same Map instances.
 */

// key: userId (string) → { userId, name, zone, lat, lng, socketId, timestamp, isOnline }
const volunteerLocations = new Map();

// key: socketId (string) → { userId, name, role, zone }
const authenticatedSockets = new Map();

// key: userId (string) → { count, windowStart } — for rate limiting chat messages
const messageCounts = new Map();

module.exports = { volunteerLocations, authenticatedSockets, messageCounts };
