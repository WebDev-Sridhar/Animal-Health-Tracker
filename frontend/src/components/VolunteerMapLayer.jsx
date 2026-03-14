/**
 * VolunteerMapLayer — renders live volunteer location markers inside an
 * existing <MapContainer>. Must be used as a child of MapContainer.
 *
 * Reads volunteer locations from SocketContext so markers update in real-time
 * without any prop drilling.
 */

import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useSocket } from '../context/SocketContext';

// Green square marker — visually distinct from the round animal condition markers
function createVolunteerIcon() {
  return L.divIcon({
    className: 'volunteer-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: #2e6b5a;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(46,107,90,0.5);
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

const volunteerIcon = createVolunteerIcon();

function timeAgo(isoString) {
  if (!isoString) return 'unknown';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  return `${mins} mins ago`;
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
            icon={volunteerIcon}
          >
            <Popup>
              <div style={{ minWidth: 140 }}>
                <p style={{ fontWeight: 800, color: '#2e6b5a', margin: '0 0 4px' }}>
                  🤝 {vol.name}
                </p>
                {vol.zone && (
                  <p style={{ fontSize: 12, color: '#6b8075', margin: '0 0 2px' }}>
                    📍 {vol.zone}
                  </p>
                )}
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                  🟢 Online · {timeAgo(vol.timestamp)}
                </p>
              </div>
            </Popup>
          </Marker>
        )),
    [volunteerLocations]
  );

  return <>{markers}</>;
}
