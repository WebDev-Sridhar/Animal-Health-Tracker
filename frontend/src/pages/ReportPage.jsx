import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const CONDITION_OPTIONS = [
  { value: "healthy", label: "Healthy" },
  { value: "injured", label: "Injured" },
  { value: "sick", label: "Sick" },
  { value: "aggressive", label: "Aggressive" },
  { value: "vaccination-needed", label: "Vaccination Needed" },
  { value: "critical", label: "Critical" },
  { value: "for-adoption", label: "For Adoption" },
];

const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "cow", label: "Cow" },
  { value: "goat", label: "Goat" },
  { value: "other", label: "Other" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unknown", label: "Unknown" },
];

const VACCINATION_STATUS_OPTIONS = [
  { value: "up-to-date", label: "Up-to-date" },
  { value: "unknown", label: "Unknown" },
  { value: "not-vaccinated", label: "Not Vaccinated" },
];

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    const addr = data.address || {};
    return (
      [addr.suburb, addr.neighbourhood, addr.village, addr.city, addr.state]
        .filter(Boolean)
        .join(", ") || "Unknown location"
    );
  } catch {
    return null;
  }
}

export default function ReportPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [form, setForm] = useState({
    species: "dog",
    gender: "unknown",
    approxAge: "",
    vaccinationStatus: "",
    description: "",
    condition: "injured",
    photo: "",
    photoFile: null,
    zone: "",
    location: null,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE) {
      setError(`Photo must be under ${MAX_PHOTO_SIZE / 1024}KB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((p) => ({ ...p, photo: reader.result, photoFile: file }));
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(
    () => setForm((p) => ({ ...p, photo: "", photoFile: null })),
    [],
  );

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const zoneName = await reverseGeocode(lat, lng);
      setForm((p) => ({
        ...p,
        location: { type: "Point", coordinates: [lng, lat] },
        zone: zoneName || p.zone,
      }));
    } catch (err) {
      setLocationError(
        err.code === 1
          ? "Location access denied. Please enable location in your browser."
          : "Could not detect location. Please try again.",
      );
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return navigate("/login");

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all non-file fields
      Object.keys(form).forEach((key) => {
        if (!form[key] || key === "photoFile") return; // skip empty and the File object
        if (key === "location") {
          formData.append(key, JSON.stringify(form[key])); // stringify location object
        } else {
          formData.append(key, form[key]);
        }
      });

      // Append the file separately with correct field name 'photo'
      if (form.photoFile) {
        formData.append("photo", form.photoFile);
      }

      // Send to backend
      await apiClient.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setForm({
        species: "dog",
        gender: "unknown",
        approxAge: "",
        vaccinationStatus: "",
        description: "",
        condition: "injured",
        photo: "",
        photoFile: null,
        zone: "",
        location: null,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to submit report",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center fade-in-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Report a Pet</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Help care for pets in need. Your observation could help ensure every
          pet gets the attention they deserve.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="card p-6 fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 2.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-amber-800 font-medium">
                Authentication Required
              </p>
              <p className="text-amber-700 text-sm">
                Please{" "}
                <Link
                  to="/login"
                  className="font-semibold underline hover:no-underline"
                >
                  log in
                </Link>{" "}
                to submit a report.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card p-4 bg-red-50 border-red-200 fade-in-up">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="card p-4 bg-green-50 border-green-200 fade-in-up">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-800">
              Report submitted successfully. Thank you for helping care for
              pets!
            </p>
          </div>
        </div>
      )}

      <div className="card p-8 fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Species */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Species
              </label>
              <select
                name="species"
                value={form.species}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {SPECIES_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Approx Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Approx Age (years)
              </label>
              <input
                type="number"
                name="approxAge"
                value={form.approxAge}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g. 2"
              />
            </div>

            {/* Vaccination Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vaccination Status
              </label>
              <select
                name="vaccinationStatus"
                value={form.vaccinationStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Select status</option>
                {VACCINATION_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Condition
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {CONDITION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the pet's condition, appearance, behavior, and where you saw it..."
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo
            </label>
            {form.photo ? (
              <div className="relative inline-block">
                <img
                  src={form.photo}
                  alt="Preview"
                  className="h-40 w-auto rounded-xl border border-gray-200 object-cover shadow-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 group-hover:text-green-500 transition-colors mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-gray-600 font-medium">
                    Click to upload photo
                  </span>
                  <span className="text-gray-400 text-sm mt-1 block">
                    PNG, JPG, WebP up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={detectLocation}
                disabled={locationLoading}
                className="btn-secondary text-sm"
              >
                {locationLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
                    Detecting location...
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Auto-detect location
                  </>
                )}
              </button>
              {locationError && (
                <p className="text-red-600 text-sm">{locationError}</p>
              )}
              {form.location && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Location detected:{" "}
                  {form.zone ||
                    `${form.location.coordinates[1].toFixed(4)}, ${form.location.coordinates[0].toFixed(4)}`}
                </div>
              )}
              <input
                type="text"
                name="zone"
                value={form.zone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Or type zone/area manually"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Submitting Report...
              </div>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
