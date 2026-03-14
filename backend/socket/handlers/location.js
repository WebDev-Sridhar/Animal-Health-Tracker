/**
 * Volunteer live location handler.
 * Only authenticated volunteers can update their location.
 * Broadcasts the full updated list to all connected clients on every change.
 */

const { authenticatedSockets, volunteerLocations } = require('../state');
const { isValidCoord } = require('../utils');

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
function registerLocationHandlers(socket, io) {
  // Volunteer sends a new GPS fix
  socket.on('locationUpdate', ({ lat, lng } = {}) => {
    const session = authenticatedSockets.get(socket.id);

    // Guard: must be authenticated volunteer
    if (!session || session.role !== 'volunteer') return;

    // Validate coordinate ranges
    if (!isValidCoord(lat, -90, 90) || !isValidCoord(lng, -180, 180)) {
      console.warn(`[Location] Invalid coords from ${socket.id}: ${lat}, ${lng}`);
      return;
    }

    // Upsert into the shared Map
    volunteerLocations.set(session.userId, {
      userId: session.userId,
      name: session.name,
      zone: session.zone,
      lat,
      lng,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      isOnline: true,
    });

    // Broadcast updated list to everyone
    io.emit('volunteerLocations', [...volunteerLocations.values()]);
  });

  // Volunteer explicitly goes offline (e.g., toggles off sharing)
  socket.on('volunteerOffline', () => {
    const session = authenticatedSockets.get(socket.id);
    if (!session || session.role !== 'volunteer') return;

    const existing = volunteerLocations.get(session.userId);
    if (existing) {
      existing.isOnline = false;
      existing.offlineSince = new Date().toISOString();
      volunteerLocations.set(session.userId, existing);
    }
    // Broadcast updated list with isOnline: false so clients show gray marker
    io.emit('volunteerLocations', [...volunteerLocations.values()]);
  });
}

module.exports = { registerLocationHandlers };
