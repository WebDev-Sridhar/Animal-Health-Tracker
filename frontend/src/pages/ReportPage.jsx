import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const CONDITION_OPTIONS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'injured', label: 'Injured' },
  { value: 'sick', label: 'Sick' },
  { value: 'aggressive', label: 'Aggressive' },
  { value: 'vaccination-needed', label: 'Vaccination Needed' },
  { value: 'critical', label: 'Critical' },
  { value: 'for-adoption', label: 'For Adoption' },

];

const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'cow', label: 'Cow' },
  { value: 'goat', label: 'Goat' },
  { value: 'other', label: 'Other' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

const VACCINATION_STATUS_OPTIONS = [
  { value: 'up-to-date', label: 'Up-to-date' },
  { value: 'unknown', label: 'Unknown' },
  { value: 'not-vaccinated', label: 'Not Vaccinated' },
];

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    return [addr.suburb, addr.neighbourhood, addr.village, addr.city, addr.state]
      .filter(Boolean)
      .join(', ') || 'Unknown location';
  } catch {
    return null;
  }
}

export default function ReportPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [form, setForm] = useState({
    species: 'dog',
    gender: 'unknown',
    approxAge: '',
    vaccinationStatus: '',
    description: '',
    condition: 'injured',
    photo: '',
    photoFile: null,
    zone: '',
    location: null,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError('');
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_SIZE) {
      setError(`Photo must be under ${MAX_PHOTO_SIZE / 1024}KB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, photo: reader.result, photoFile: file }));
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(() => setForm((p) => ({ ...p, photo: '', photoFile: null })), []);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
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
        location: { type: 'Point', coordinates: [lng, lat] },
        zone: zoneName || p.zone,
      }));
    } catch (err) {
      setLocationError(
        err.code === 1
          ? 'Location access denied. Please enable location in your browser.'
          : 'Could not detect location. Please try again.'
      );
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isAuthenticated) return navigate('/login');

  setError('');
  setSuccess(false);
  setLoading(true);

  try {
    const formData = new FormData();

    // Append all non-file fields
    Object.keys(form).forEach((key) => {
      if (!form[key] || key === 'photoFile') return; // skip empty and the File object
      if (key === 'location') {
        formData.append(key, JSON.stringify(form[key])); // stringify location object
      } else {
        formData.append(key, form[key]);
      }
    });

    // Append the file separately with correct field name 'photo'
    if (form.photoFile) {
      formData.append('photo', form.photoFile);
    }

    // Send to backend
    await apiClient.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Reset form
    setForm({
      species: 'dog',
      gender: 'unknown',
      approxAge: '',
      vaccinationStatus: '',
      description: '',
      condition: 'injured',
      photo: '',
      photoFile: null,
      zone: '',
      location: null,
    });

    setSuccess(true);
  } catch (err) {
    setError(err.response?.data?.error || err.message || 'Failed to submit report');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">Report an Animal</h1>
      <p className="text-slate-600 text-sm mb-6">Help track animals in need by submitting a report with photo and location.</p>

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            Please{' '}
            <Link to="/login" className="font-medium underline hover:no-underline">
              log in
            </Link>{' '}
            to submit a report.
          </p>
        </div>
      )}

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}
      {success && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">Report submitted successfully. Thank you for helping!</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Species */}
        <div >
          <label className="block text-sm font-medium text-slate-700 mb-2">Species</label>
          <select name="species" value={form.species} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2.5">
            {SPECIES_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2.5">
            {GENDER_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Approx Age */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Approx Age (years)</label>
          <input type="number" name="approxAge" value={form.approxAge} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2.5"  />
        </div>

        {/* Vaccination Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Vaccination Status</label>
          <select name="vaccinationStatus" value={form.vaccinationStatus} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2.5">
            <option value="">Select status</option>
            {VACCINATION_STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
          <select name="condition" value={form.condition} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2.5">
            {CONDITION_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2.5" placeholder="Describe the animal's condition, appearance, and where you saw it..." />
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Photo</label>
          {form.photo ? (
            <div className="relative inline-block">
              <img src={form.photo} alt="Preview" className="h-32 w-auto rounded-lg border border-slate-200 object-cover" />
              <button type="button" onClick={removePhoto} className="absolute top-1 right-1 p-1 bg-slate-800 text-white rounded text-xs hover:bg-slate-700">Remove</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-slate-50 transition-colors">
              <span className="text-slate-500 text-sm">Click to upload</span>
              <span className="text-slate-400 text-xs mt-1">PNG, JPG, WebP up to 5MB</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
          <div className="flex gap-2">
            <button type="button" onClick={detectLocation} disabled={locationLoading} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
              {locationLoading ? 'Detecting...' : 'Auto-detect location'}
            </button>
            {form.location && <span className="text-emerald-600 text-sm py-2.5 flex items-center">✓ Detected</span>}
          </div>
          {locationError && <p className="mt-2 text-red-600 text-sm">{locationError}</p>}
          {form.location && <p className="mt-2 text-slate-600 text-sm">{form.zone || `${form.location.coordinates[1].toFixed(4)}, ${form.location.coordinates[0].toFixed(4)}`}</p>}
          <input type="text" name="zone" value={form.zone} onChange={handleChange} className="mt-2 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="Or type zone/area manually" />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading || !isAuthenticated} className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}