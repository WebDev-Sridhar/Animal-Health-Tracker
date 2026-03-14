/**
 * SocketContext — provides the Socket.IO connection, shared real-time state
 * (volunteer locations, emergency alerts, unread chat counts), and persistent
 * location sharing to the entire app.
 *
 * Must be rendered inside <AuthProvider> because it reads useAuth().
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getSocket, disconnectSocket } from '../socket/socketClient';
import { apiClient } from '../api/client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [volunteerLocations, setVolunteerLocations] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  // unreadChats: { [reportId]: { count, senderName, lastMessage } }
  const [unreadChats, setUnreadChats] = useState({});

  // ── Global location sharing state ──
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const watchIdRef = useRef(null);

  // Dismiss an emergency alert by its reportId
  const dismissAlert = useCallback((reportId) => {
    setEmergencyAlerts((prev) => prev.filter((a) => a.reportId !== reportId));
  }, []);

  // Mark all messages in a chat as read
  const markChatRead = useCallback((reportId) => {
    if (!reportId) return;
    setUnreadChats((prev) => {
      const next = { ...prev };
      delete next[reportId];
      return next;
    });
  }, []);

  // ── Location sharing functions ──
  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationError(null);
    const socket = getSocket();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        socket.emit('locationUpdate', { lat, lng });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please allow access in your browser settings.');
        } else {
          setLocationError('Unable to retrieve your location. Please try again.');
        }
        // Stop sharing on error
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        setIsSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 }
    );

    setIsSharing(true);
  }, []);

  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    const socket = getSocket();
    socket.emit('volunteerOffline');
    setIsSharing(false);
  }, []);

  // ── Socket event listeners (stable, run once) ──
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onVolunteerLocations = (locations) => setVolunteerLocations(locations);

    const onVolunteerJoined = (vol) => {
      setVolunteerLocations((prev) => {
        const without = prev.filter((v) => v.userId !== vol.userId);
        return [...without, vol];
      });
    };

    // Mark volunteer offline instead of removing (keep gray marker)
    const onVolunteerLeft = ({ userId }) => {
      setVolunteerLocations((prev) =>
        prev.map((v) => (v.userId === userId ? { ...v, isOnline: false } : v))
      );
    };

    const onAnimalEmergency = (alert) => {
      setEmergencyAlerts((prev) => {
        const without = prev.filter((a) => a.reportId !== alert.reportId);
        return [{ ...alert, receivedAt: Date.now() }, ...without].slice(0, 5);
      });
    };

    const onChatNotification = ({ reportId, senderName, text }) => {
      setUnreadChats((prev) => ({
        ...prev,
        [reportId]: {
          count: (prev[reportId]?.count || 0) + 1,
          senderName,
          lastMessage: text,
        },
      }));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('volunteerLocations', onVolunteerLocations);
    socket.on('volunteerJoined', onVolunteerJoined);
    socket.on('volunteerLeft', onVolunteerLeft);
    socket.on('animalEmergency', onAnimalEmergency);
    socket.on('chatNotification', onChatNotification);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('volunteerLocations', onVolunteerLocations);
      socket.off('volunteerJoined', onVolunteerJoined);
      socket.off('volunteerLeft', onVolunteerLeft);
      socket.off('animalEmergency', onAnimalEmergency);
      socket.off('chatNotification', onChatNotification);
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

      const sendAuth = () => socket.emit('authenticate', { token });

      if (socket.connected) {
        sendAuth();
      } else {
        socket.once('connect', sendAuth);
      }

      // Fetch unread counts from backend after socket authenticates
      const onAuthenticated = async () => {
        try {
          const res = await apiClient.get('/chat/unread');
          const data = res.data || res;
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            setUnreadChats(data);
          }
        } catch (err) {
          console.error('[SocketContext] Failed to fetch unread counts:', err.message);
        }
      };
      socket.on('authenticated', onAuthenticated);

      return () => {
        socket.off('authenticated', onAuthenticated);
      };
    } else {
      // Logout: clean up everything
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsSharing(false);
      setLocationError(null);
      setVolunteerLocations([]);
      setEmergencyAlerts([]);
      setUnreadChats({});
      disconnectSocket();
    }
  }, [isAuthenticated]);

  // ── Cleanup location sharing on browser close ──
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        const socket = getSocket();
        socket.emit('volunteerOffline');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Total unread across all conversations
  const totalUnread = Object.values(unreadChats).reduce((sum, c) => sum + c.count, 0);

  const value = {
    socket: getSocket(),
    isConnected,
    volunteerLocations,
    emergencyAlerts,
    dismissAlert,
    unreadChats,
    totalUnread,
    markChatRead,
    // Location sharing
    isSharing,
    startSharing,
    stopSharing,
    locationError,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within <SocketProvider>');
  return ctx;
}
