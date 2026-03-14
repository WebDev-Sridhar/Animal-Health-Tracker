/**
 * VolunteerMapLayer — renders live volunteer location markers inside an
 * existing <MapContainer>. Must be used as a child of MapContainer.
 *
 * Shows green markers for online volunteers and gray markers for offline
 * (last known location). Reads volunteer locations from SocketContext.
 */

import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useSocket } from '../context/SocketContext';

function createVolunteerIcon(isOnline = true) {
  const bg = isOnline ? '#2e6b5a' : '#9ca3af';
  const shadow = isOnline ? 'rgba(46,107,90,0.5)' : 'rgba(156,163,175,0.4)';
  return L.divIcon({
    className: 'volunteer-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${bg};
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 1;
      ">🤝</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const onlineIcon = createVolunteerIcon(true);
const offlineIcon = createVolunteerIcon(false);

function timeAgo(isoString) {
  if (!isoString) return 'unknown';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function VolunteerMapLayer() {
  const { volunteerLocations } = useSocket();

  const markers = useMemo(
    () =>
      volunteerLocations
        .filter((v) => v.lat && v.lng)
        .map((vol) => (
          <Marker
            key={vol.userId}
            position={[vol.lat, vol.lng]}
            icon={vol.isOnline !== false ? onlineIcon : offlineIcon}
          >
            <Popup>
              <div style={{ minWidth: 150 }}>
                <p style={{ fontWeight: 800, color: vol.isOnline !== false ? '#2e6b5a' : '#6b7280', margin: '0 0 4px' }}>
                  🤝 {vol.name}
                </p>
                {vol.zone && (
                  <p style={{ fontSize: 12, color: '#6b8075', margin: '0 0 2px' }}>
                    📍 {vol.zone}
                  </p>
                )}
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: vol.isOnline !== false ? '#22c55e' : '#9ca3af',
                    marginRight: 4,
                    verticalAlign: 'middle',
                  }} />
                  {vol.isOnline !== false ? 'Online' : 'Offline'} · {timeAgo(vol.timestamp)}
                </p>
              </div>
            </Popup>
          </Marker>
        )),
    [volunteerLocations]
  );

  return <>{markers}</>;
}
