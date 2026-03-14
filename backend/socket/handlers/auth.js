/**
 * Socket authentication handler.
 * Verifies the JWT sent by the client on the 'authenticate' event,
 * populates authenticatedSockets, and — for volunteers — sends
 * the current volunteer locations list.
 */

const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const config = require('../../config');
const { authenticatedSockets, volunteerLocations } = require('../state');

/**
 * @param {import('socket.io').Socket} socket
 */
function registerAuthHandlers(socket) {
  socket.on('authenticate', async ({ token } = {}) => {
    if (!token) {
      socket.emit('authError', { message: 'No token provided' });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.id).select('name role zone').lean();

      if (!user) {
        socket.emit('authError', { message: 'User not found' });
        return;
      }

      // Store authenticated session
      authenticatedSockets.set(socket.id, {
        userId: user._id.toString(),
        name: user.name,
        role: user.role,
        zone: user.zone || '',
      });

      socket.emit('authenticated', { userId: user._id.toString(), role: user.role });

      // Send existing volunteer positions immediately to this socket
      const locations = [...volunteerLocations.values()];
      if (locations.length > 0) {
        socket.emit('volunteerLocations', locations);
      }

      console.log(`[Socket] Authenticated: ${user.name} (${user.role}) — ${socket.id}`);
    } catch (err) {
      socket.emit('authError', { message: 'Invalid or expired token' });
    }
  });
}

module.exports = { registerAuthHandlers };
