import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { animalsApi } from "../api/animals";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
const DEFAULT_RADIUS = 10000; // 10km in meters

export default function HomePage() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  useEffect(() => {
    const fetchLocationAndAnimals = async () => {
      setError("");
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
        if (
          err.message?.includes("401") ||
          err.message?.toLowerCase().includes("authorized")
        ) {
          setError("Login to view animals on the map");
        } else {
          setError(err.message || "Failed to load animals");
        }
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndAnimals();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 fade-in-up">
        <div className="card p-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-800">
            Care for Your Furry Friends
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community in monitoring and caring for domestic animals.
            Track health conditions, report concerns, and help ensure every pet
            gets the care they deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report" className="btn-primary">
              Report a Pet
            </Link>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="fade-in-up">
        <div className="card p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Pet Health Map
              </h2>
              <p className="text-gray-600">
                Track and monitor pets by location in real-time
              </p>
            </div>
            <Link to="/report" className="btn-primary">
              Report Sighting
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm fade-in-up">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <span className="text-gray-600">
                    Loading pet health map...
                  </span>
                </div>
              </div>
            )}
            <MapComponent
              center={center}
              animals={animals}
              height="500px"
              onMarkerClick={setSelectedAnimal}
              className="rounded-xl overflow-hidden"
            />
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-600"></div>
              <span className="text-gray-700">Sick</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-gray-700">Injured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-700">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-gray-700">Aggressive</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-6 fade-in-up">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-pink-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {animals.length}
          </h3>
          <p className="text-gray-600">Pets Tracked</p>
        </div>
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">24/7</h3>
          <p className="text-gray-600">Care Monitoring</p>
        </div>
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">500+</h3>
          <p className="text-gray-600">Pet Owners</p>
        </div>
      </section>
    </div>
  );
}
