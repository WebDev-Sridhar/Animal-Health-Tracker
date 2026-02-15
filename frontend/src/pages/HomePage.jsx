import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { animalsApi } from '../api/animals';

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
const DEFAULT_RADIUS = 10000; // 10km in meters

export default function HomePage() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    const fetchLocationAndAnimals = async () => {
      setError('');
      let lat = DEFAULT_CENTER.lat;
      let lng = DEFAULT_CENTER.lng;

      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 300000,
            });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          setCenter({ lat, lng });
        } catch {
          // Use default center if geolocation fails
        }
      }

      try {
        const res = await animalsApi.getNearby(lat, lng, DEFAULT_RADIUS);
        setAnimals(res.data || []);
      } catch (err) {
        if (err.message?.includes('401') || err.message?.toLowerCase().includes('authorized')) {
          setError('Login to view animals on the map');
        } else {
          setError(err.message || 'Failed to load animals');
        }
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndAnimals();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Map View</h1>
          <p className="text-slate-600 text-sm mt-1">
            Track and monitor animals by location
          </p>
        </div>
        <Link
          to="/report"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center"
        >
          Report an Animal
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/70 rounded-lg">
            <span className="text-slate-600">Loading map...</span>
          </div>
        )}
        <MapComponent
          center={center}
          animals={animals}
          height="450px"
          onMarkerClick={setSelectedAnimal}
        />
      </div>

      <div className="mt-4 flex gap-4 text-sm text-slate-500">
        <span>
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-1"></span>
          Healthy
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded-full bg-purple-600 mr-1"></span>
          Sick
        </span>
          <span>
          <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
          Injured
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
          Critical
        </span>
      </div>
    </div>
  );
}
