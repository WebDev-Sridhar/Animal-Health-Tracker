/**
 * useVolunteerLocation — thin wrapper that delegates to SocketContext.
 * Location sharing is now managed globally so it persists across page navigation.
 */

import { useSocket } from '../context/SocketContext';

export function useVolunteerLocation() {
  const { isSharing, startSharing, stopSharing, locationError } = useSocket();
  return { isSharing, startSharing, stopSharing, locationError };
}
