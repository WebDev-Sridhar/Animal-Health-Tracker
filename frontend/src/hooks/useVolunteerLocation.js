/**
 * useVolunteerLocation — volunteer-only hook.
 * Starts/stops GPS sharing via the browser Geolocation API
 * and emits location updates through the socket.
 */

import { useState, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

export function useVolunteerLocation() {
  const { socket } = useSocket();
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const watchIdRef = useRef(null);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationError(null);

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
        stopSharing();
      },
      {
        enableHighAccuracy: true,
        // Accept cached position up to 30s old (avoids hammering GPS)
        maximumAge: 30_000,
        timeout: 15_000,
      }
    );

    setIsSharing(true);
  }, [socket]);

  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    socket.emit('volunteerOffline');
    setIsSharing(false);
  }, [socket]);

  return { isSharing, startSharing, stopSharing, locationError };
}
