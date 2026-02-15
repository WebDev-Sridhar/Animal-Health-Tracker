import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon path for react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const HEALTH_COLORS = {
  healthy: '#22c55e',
  sick:  '#8b5cf6' ,
  critical: '#ef4444',
  injured: '#f59e0b',
  vaccination_needed: '#3b82f6',
};

const createColoredIcon = (healthStatus) => {
  const color = HEALTH_COLORS[healthStatus] || '#94a3b8'; // default gray for unknown
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center?.lat != null && center?.lng != null) {
      map.setView([center.lat, center.lng], zoom ?? map.getZoom());
    }
  }, [center?.lat, center?.lng, zoom, map]);
  return null;
}

export default function MapComponent({
  center = { lat: 12.9716, lng: 77.5946 },
  zoom = 10,
  animals = [],
  height = '400px',
  onMarkerClick,
  className = '',
}) {
  const animalMarkers = useMemo(
    () =>
      animals
        .filter((a) => a.location?.coordinates?.length >= 2)
        .map((animal) => {
          const [lng, lat] = animal.location.coordinates;
          return { ...animal, lat, lng };
        }),
    [animals]
  );

  return (
    <div className={`rounded-lg overflow-hidden border border-slate-200 ${className}`} style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />

        {animalMarkers.map((animal) => (
          <Marker
            key={animal._id}
            position={[animal.lat, animal.lng]}
            icon={createColoredIcon(animal.healthStatus)}
            eventHandlers={{
              click: () => onMarkerClick?.(animal),
            }}
          >
            <Popup>
              <div className="min-w-45 text-sm">
                <div className="font-semibold text-slate-800 capitalize">{animal.species}</div>
                <div className="mt-1 space-y-0.5 text-slate-600">
                  <p>
                    <span className="font-medium">Health Status:</span>{' '}
                    <span
                      className={
                        animal.healthStatus === 'critical'
                          ? 'text-red-600'
                          : animal.healthStatus === 'sick'
                            ? 'text-purple-600'
                            : animal.healthStatus === 'injured'
                              ? 'text-amber-600'
                              : animal.healthStatus === 'vaccination_needed'
                                ? 'text-blue-600'
                            : 'text-emerald-600'
                      }
                    >
                      {animal.healthStatus}
                    </span>
                  </p>
                  {animal.gender && <p>Gender: {animal.gender}</p>}
                  {animal.approxAge && <p>Age: {animal.approxAge}</p>}
                  {animal.description && <p>Description: {animal.description}</p>}
                  {animal.zone && <p>Zone: {animal.zone}</p>}
                  <p>Vaccination: {animal.vaccinationStatus || '—'}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
