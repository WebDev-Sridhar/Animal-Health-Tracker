/**
 * Socket.IO client singleton.
 *
 * Creates the socket instance once and reuses it across the app.
 * autoConnect: false — the SocketContext controls when to connect/disconnect
 * based on auth state, so we never create a socket that immediately connects.
 */

import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      autoConnect: false,
      // Try WebSocket first (faster), fall back to long-polling for Render free tier
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    // Do NOT null socket — the SocketContext attaches listeners once (useEffect [])
    // and they must survive logout/login cycles. A disconnected socket can reconnect
    // on the same instance, preserving all registered event listeners.
  }
}
