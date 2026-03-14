/**
 * Socket.IO server — singleton initialiser.
 *
 * Usage in server.js:
 *   const { init: initSocket } = require('./socket/index');
 *   const server = http.createServer(app);
 *   initSocket(server);
 *   server.listen(port);
 *
 * Usage anywhere else (e.g. reportService.js):
 *   const { getIO } = require('./socket/index');
 *   getIO().emit(...);
 */

const { Server } = require('socket.io');
const { authenticatedSockets, volunteerLocations } = require('./state');
const { registerAuthHandlers } = require('./handlers/auth');
const { registerLocationHandlers } = require('./handlers/location');
const { registerChatHandlers } = require('./handlers/chat');

let _io = null;

/**
 * Initialise Socket.IO and attach all event handlers.
 * Must be called once before getIO() is used.
 *
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
function init(httpServer) {
  _io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL
        ? [process.env.CLIENT_URL, 'http://localhost:5173']
        : ['http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Socket.IO will try WebSocket first and fall back to long-polling
    // (important for Render's free tier which supports both)
    transports: ['websocket', 'polling'],
  });

  _io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── Security: disconnect if not authenticated within 10 seconds ──
    const authTimeout = setTimeout(() => {
      if (!authenticatedSockets.has(socket.id)) {
        console.log(`[Socket] Auth timeout — disconnecting ${socket.id}`);
        socket.disconnect(true);
      }
    }, 10_000);

    // Clear timeout once authenticated (auth handler sets the Map entry)
    socket.once('authenticated', () => clearTimeout(authTimeout));
    // Also clear if they emit authError (the handler emits to them, not us)
    // We watch the Map instead:
    socket.on('authenticate', () => {
      // After a short delay check if auth succeeded
      setTimeout(() => {
        if (authenticatedSockets.has(socket.id)) clearTimeout(authTimeout);
      }, 500);
    });

    // Register feature handlers
    registerAuthHandlers(socket);
    registerLocationHandlers(socket, _io);
    registerChatHandlers(socket, _io);

    // ── Disconnect cleanup ──
    socket.on('disconnect', (reason) => {
      const session = authenticatedSockets.get(socket.id);

      if (session) {
        // Remove volunteer from live map and notify all clients
        if (session.role === 'volunteer' && volunteerLocations.has(session.userId)) {
          volunteerLocations.delete(session.userId);
          _io.emit('volunteerLeft', { userId: session.userId });
          console.log(`[Socket] Volunteer offline: ${session.name}`);
        }
        authenticatedSockets.delete(socket.id);
      }

      clearTimeout(authTimeout);
      console.log(`[Socket] Disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log('[Socket] Socket.IO initialized');
  return _io;
}

/**
 * Get the Socket.IO server instance.
 * Throws if init() has not been called yet.
 *
 * @returns {import('socket.io').Server}
 */
function getIO() {
  if (!_io) throw new Error('[Socket] Socket.IO not initialized — call init(httpServer) first');
  return _io;
}

module.exports = { init, getIO };
