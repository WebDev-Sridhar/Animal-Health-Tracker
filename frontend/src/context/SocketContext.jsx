/**
 * SocketContext — provides the Socket.IO connection and shared real-time
 * state (volunteer locations, emergency alerts) to the entire app.
 *
 * Must be rendered inside <AuthProvider> because it reads useAuth().
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getSocket, disconnectSocket } from '../socket/socketClient';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [volunteerLocations, setVolunteerLocations] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  // Dismiss an alert by its reportId
  const dismissAlert = useCallback((reportId) => {
    setEmergencyAlerts((prev) => prev.filter((a) => a.reportId !== reportId));
  }, []);

  useEffect(() => {
    const socket = getSocket();

    // ── Connection lifecycle ──
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // ── Volunteer location events ──
    const onVolunteerLocations = (locations) => setVolunteerLocations(locations);

    const onVolunteerJoined = (vol) => {
      setVolunteerLocations((prev) => {
        const without = prev.filter((v) => v.userId !== vol.userId);
        return [...without, vol];
      });
    };

    const onVolunteerLeft = ({ userId }) => {
      setVolunteerLocations((prev) => prev.filter((v) => v.userId !== userId));
    };

    // ── Emergency alerts ──
    const onAnimalEmergency = (alert) => {
      setEmergencyAlerts((prev) => {
        // Avoid duplicate alerts for the same report
        const without = prev.filter((a) => a.reportId !== alert.reportId);
        return [{ ...alert, receivedAt: Date.now() }, ...without].slice(0, 5);
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('volunteerLocations', onVolunteerLocations);
    socket.on('volunteerJoined', onVolunteerJoined);
    socket.on('volunteerLeft', onVolunteerLeft);
    socket.on('animalEmergency', onAnimalEmergency);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('volunteerLocations', onVolunteerLocations);
      socket.off('volunteerJoined', onVolunteerJoined);
      socket.off('volunteerLeft', onVolunteerLeft);
      socket.off('animalEmergency', onAnimalEmergency);
    };
  }, []);

  // ── Connect / authenticate when user logs in, disconnect on logout ──
  useEffect(() => {
    const socket = getSocket();

    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (!socket.connected) {
        socket.connect();
      }

      // Authenticate as soon as the socket connects (or immediately if already connected)
      const sendAuth = () => socket.emit('authenticate', { token });

      if (socket.connected) {
        sendAuth();
      } else {
        socket.once('connect', sendAuth);
      }
    } else {
      // User logged out — clean up
      setVolunteerLocations([]);
      setEmergencyAlerts([]);
      disconnectSocket();
    }
  }, [isAuthenticated]);

  const value = {
    socket: getSocket(),
    isConnected,
    volunteerLocations,
    emergencyAlerts,
    dismissAlert,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within <SocketProvider>');
  return ctx;
}
