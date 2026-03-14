import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 1000;

const CONDITION_OPTIONS = [
  { value: "for-adoption", label: "For Adoption", emoji: "🏡" },
  { value: "healthy", label: "Healthy", emoji: "✅" },
  { value: "injured", label: "Injured", emoji: "🤕" },
  { value: "sick", label: "Sick", emoji: "🤒" },
  { value: "aggressive", label: "Aggressive", emoji: "⚠️" },
  { value: "vaccination-needed", label: "Vaccination Needed", emoji: "💉" },
  { value: "critical", label: "Critical", emoji: "🚨" },
];

const SPECIES_OPTIONS = [
  { value: "dog", label: "Dog", emoji: "🐕" },
  { value: "cat", label: "Cat", emoji: "🐈" },
  { value: "cow", label: "Cow", emoji: "🐄" },
  { value: "goat", label: "Goat", emoji: "🐐" },
  { value: "other", label: "Other", emoji: "🐾" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male", emoji: "♂️" },
  { value: "female", label: "Female", emoji: "♀️" },
  { value: "unknown", label: "Unknown", emoji: "❓" },
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
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const addr = data.address || {};
    return [addr.suburb, addr.neighbourhood, addr.village, addr.city, addr.state]
      .filter(Boolean).join(", ") || "Unknown location";
  } catch { return null; }
}

const STEPS = ["Animal Info", "Condition & Photo", "Location & Submit"];

export default function ReportPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [customSpecies, setCustomSpecies] = useState("");
  const [ageUnit, setAgeUnit] = useState("months");
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
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`Invalid image format. Allowed: JPEG, PNG, WebP.`);
      return;
    }
    const fileName = file.name.toLowerCase();
    if (!ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))) {
      setError(`Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 5MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, photo: reader.result, photoFile: file }));
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(() => setForm((p) => ({ ...p, photo: "", photoFile: null })), []);

  const validateStep0 = () => {
    if (!form.species) { setError("Please select the animal's species."); return false; }
    if (form.species === "other" && !customSpecies.trim()) { setError("Please enter the species name."); return false; }
    if (!form.gender) { setError("Please select the animal's gender."); return false; }
    if (!form.approxAge || Number(form.approxAge) <= 0) { setError("Please enter a valid age."); return false; }
    if (!form.vaccinationStatus) { setError("Please select the vaccination status."); return false; }
    return true;
  };

  const validateStep1 = () => {
    if (!form.condition) { setError("Please select the animal's condition."); return false; }
    if (!form.description.trim()) { setError("Please describe the animal's condition."); return false; }
    if (form.description.trim().length < MIN_DESCRIPTION_LENGTH) {
      setError(`Description needs at least ${MIN_DESCRIPTION_LENGTH} characters.`); return false;
    }
    if (form.description.trim().length > MAX_DESCRIPTION_LENGTH) {
      setError(`Description exceeds ${MAX_DESCRIPTION_LENGTH} characters.`); return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!form.zone.trim()) { setError("Please enter the location/zone."); return false; }
    if (!form.location?.coordinates) { setError("Please detect your location or enter a zone name."); return false; }
    return true;
  };

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) { setLocationError("Geolocation not supported."); return; }
    setLocationLoading(true);
    setLocationError("");
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
      );
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const zoneName = await reverseGeocode(lat, lng);
      setForm((p) => ({ ...p, location: { type: "Point", coordinates: [lng, lat] }, zone: zoneName || p.zone }));
    } catch (err) {
      setLocationError(err.code === 1 ? "Location access denied. Please enable location in your browser." : "Could not detect location. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    setError("");
    setSuccess(false);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const finalSpecies = form.species === "other" ? customSpecies.trim() : form.species;
      const finalAge = form.approxAge ? `${form.approxAge} ${ageUnit}` : "";
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (!form[key] || key === "photoFile") return;
        if (key === "location") formData.append(key, JSON.stringify(form[key]));
        else if (key === "species") formData.append("species", finalSpecies);
        else if (key === "approxAge") formData.append("approxAge", finalAge);
        else formData.append(key, form[key]);
      });
      if (form.photoFile) formData.append("photo", form.photoFile);
      await apiClient.post("/reports", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ species: "dog", gender: "unknown", approxAge: "", vaccinationStatus: "", description: "", condition: "injured", photo: "", photoFile: null, zone: "", location: null });
      setCustomSpecies("");
      setAgeUnit("months");
      setSuccess(true);
      setCurrentStep(0);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      let displayError = errorMessage;
      if (errorMessage?.includes("5MB") || errorMessage?.includes("too large")) displayError = `Image too large. Must be under 5MB.`;
      else if (errorMessage?.includes("format") || errorMessage?.includes("type")) displayError = `Invalid format. Only JPEG, PNG, WebP supported.`;
      setError(displayError || "Failed to submit. Please check your form and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Report Animal | OurPetCare</title>
        <meta name="description" content="Report injured, sick, or abandoned animals in Tamil Nadu. Help protect animal welfare." />
      </Helmet>

      {/* ─── Hero ─── */}
      <section className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
          Report an Injured Animal
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "#f7ede2" }}>
          Your 2-minute report could save a life. Volunteers are ready to respond across Tamil Nadu.
        </p>
      </section>

      {/* ─── Auth Warning ─── */}
      {!isAuthenticated && (
        <div className="max-w-2xl mx-auto px-6 mt-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-extrabold text-amber-800">Login Required</p>
              <p className="text-amber-700 text-sm mt-0.5">
                Please{" "}
                <Link to="/login" className="font-extrabold underline hover:no-underline">log in</Link>
                {" "}to submit a report. Don't have an account?{" "}
                <Link to="/register" className="font-extrabold underline hover:no-underline">Register free →</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step Indicator ─── */}
      <div className="max-w-2xl mx-auto px-6 mt-8">
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold transition-all ${
                  i < currentStep ? "text-white" :
                  i === currentStep ? "text-white" : "bg-gray-100 text-gray-400"
                }`} style={{
                  background: i < currentStep ? "var(--primary)" : i === currentStep ? "var(--secondary)" : undefined
                }}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-bold hidden sm:block ${
                  i === currentStep ? "text-gray-800" : "text-gray-400"
                }`}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 rounded-full mx-1"
                  style={{ background: i < currentStep ? "#3d8c78" : "#e5e7eb" }} />
              )}
            </div>
          ))}
        </div>

        {/* ─── Success Message ─── */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl text-center fade-in-up">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-extrabold text-green-800 mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>
              Report Submitted Successfully!
            </h3>
            <p className="text-green-700 text-sm mb-4">
              Thank you for helping animals in need. Our volunteers will respond shortly.
            </p>
            <button onClick={() => setSuccess(false)} className="btn-primary text-sm py-2 px-6">
              Submit Another Report
            </button>
          </div>
        )}

        {/* ─── Form ─── */}
        {!success && (
          <div className="card p-8 fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Step 0: Animal Info */}
              {currentStep === 0 && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                    Tell Us About the Animal
                  </h2>

                  {/* Species Selector */}
                  <div>
                    <label className="block text-sm font-extrabold text-gray-700 mb-2">Species <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-5 gap-2">
                      {SPECIES_OPTIONS.map((opt) => (
                        <label key={opt.value}
                          className={`p-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                            form.species === opt.value ? "border-green-600 bg-[#eaf5f1]" : "border-gray-200 hover:border-[#84c4b4]"
                          }`}>
                          <input type="radio" name="species" value={opt.value} checked={form.species === opt.value}
                            onChange={handleChange} className="sr-only" />
                          <div className="text-2xl">{opt.emoji}</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">{opt.label}</div>
                        </label>
                      ))}
                    </div>
                    {form.species === "other" && (
                      <input
                        type="text"
                        value={customSpecies}
                        onChange={(e) => { setCustomSpecies(e.target.value); setError(""); }}
                        className="input-field mt-3"
                        placeholder="Enter species name (e.g. rabbit, parrot)"
                      />
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-extrabold text-gray-700 mb-2">Gender</label>
                    <div className="grid grid-cols-3 gap-2">
                      {GENDER_OPTIONS.map((opt) => (
                        <label key={opt.value}
                          className={`p-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                            form.gender === opt.value ? "border-green-600 bg-[#eaf5f1]" : "border-gray-200 hover:border-[#84c4b4]"
                          }`}>
                          <input type="radio" name="gender" value={opt.value} checked={form.gender === opt.value}
                            onChange={handleChange} className="sr-only" />
                          <div className="text-xl">{opt.emoji}</div>
                          <div className="text-xs font-bold text-gray-700 mt-1">{opt.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Age + Vaccination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-extrabold text-gray-700 mb-2">Approx Age <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <input type="number" name="approxAge" value={form.approxAge} onChange={handleChange}
                          className="input-field flex-1 min-w-0" placeholder="e.g. 3" min="0" />
                        <select value={ageUnit} onChange={(e) => setAgeUnit(e.target.value)} className="input-field shrink-0" style={{ width: "7rem" }}>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-extrabold text-gray-700 mb-2">Vaccination Status <span className="text-red-500">*</span></label>
                      <select name="vaccinationStatus" value={form.vaccinationStatus} onChange={handleChange} className="input-field w-full">
                        <option value="">Select status</option>
                        {VACCINATION_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">⚠️</span>
                      <p className="text-red-700 text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  <button type="button" onClick={() => { if (validateStep0()) { setError(""); setCurrentStep(1); } }} className="w-full btn-primary py-3.5">
                    Next: Condition & Photo →
                  </button>
                </div>
              )}

              {/* Step 1: Condition & Photo */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                    Condition & Photo
                  </h2>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-extrabold text-gray-700 mb-2">Current Condition</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CONDITION_OPTIONS.map((opt) => (
                        <label key={opt.value}
                          className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center gap-2 transition-all ${
                            form.condition === opt.value ? "border-green-600 bg-[#eaf5f1]" : "border-gray-200 hover:border-[#84c4b4]"
                          }`}>
                          <input type="radio" name="condition" value={opt.value} checked={form.condition === opt.value}
                            onChange={handleChange} className="sr-only" />
                          <span className="text-xl">{opt.emoji}</span>
                          <span className="text-sm font-bold text-gray-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-extrabold text-gray-700 mb-2">
                      Description
                      <span className="text-gray-400 font-normal text-xs ml-2">
                        ({form.description.length}/{MAX_DESCRIPTION_LENGTH})
                      </span>
                    </label>
                    <textarea name="description" value={form.description} onChange={handleChange}
                      required rows={4} maxLength={MAX_DESCRIPTION_LENGTH}
                      className="input-field resize-none"
                      placeholder="Describe the animal's condition, appearance, behavior, and where you saw it..." />
                    {form.description.length > 0 && form.description.length < MIN_DESCRIPTION_LENGTH && (
                      <p className="text-amber-600 text-xs mt-1.5 font-semibold">
                        {MIN_DESCRIPTION_LENGTH - form.description.length} more characters needed
                      </p>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-extrabold text-gray-700 mb-2">Photo (optional but recommended)</label>
                    {form.photo ? (
                      <div className="relative inline-block">
                        <img src={form.photo} alt="Preview"
                          className="h-44 w-auto rounded-2xl object-cover shadow-lg" style={{ border: "2px solid #b0ddd3" }} />
                        <button type="button" onClick={removePhoto}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg font-bold text-sm">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#3d8c78] hover:bg-[#eaf5f1] transition-all group">
                        <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📷</span>
                        <span className="text-gray-600 font-bold text-sm">Click to upload photo</span>
                        <span className="text-gray-400 text-xs mt-1">JPG, PNG or WebP — max 5MB</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handlePhotoChange} className="hidden" />
                      </label>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">⚠️</span>
                      <p className="text-red-700 text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setError(""); setCurrentStep(0); }} className="flex-1 btn-secondary py-3">
                      ← Back
                    </button>
                    <button type="button" onClick={() => { if (validateStep1()) { setError(""); setCurrentStep(2); } }} className="flex-1 btn-primary py-3">
                      Next: Location →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Location & Submit */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                    Location Details
                  </h2>

                  <div className="p-4 rounded-2xl text-sm" style={{ background: "#f7ede2", color: "#1e3d30", border: "1px solid #edddd0" }}>
                    <p className="font-extrabold mb-1">Tip</p>
                    <p>Use "Detect Location" for accuracy, or type the area name manually. Location helps volunteers reach the animal faster.</p>
                  </div>

                  <button type="button" onClick={detectLocation} disabled={locationLoading}
                    className="w-full btn-secondary py-3 flex items-center justify-center gap-2">
                    {locationLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 rounded-full animate-spin"
                          style={{ borderColor: "rgba(61,140,120,0.25)", borderTopColor: "#3d8c78" }} />
                        Detecting location...
                      </>
                    ) : (
                      <>📍 Use My Current Location</>
                    )}
                  </button>

                  {locationError && (
                    <p className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
                      ⚠️ {locationError}
                    </p>
                  )}

                  {form.location && (
                    <div className="flex items-center gap-2 text-sm font-bold p-3 rounded-xl"
                      style={{ color: "#2e6b5a", background: "#eaf5f1" }}>
                      Location detected: {form.zone || "GPS coordinates captured"}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-extrabold text-gray-700 mb-2">
                      Zone / Area Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="zone" required value={form.zone} onChange={handleChange}
                      className="input-field" placeholder="e.g. Anna Nagar, Chennai or Coimbatore City" />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">⚠️</span>
                      <div>
                        <p className="text-red-800 font-extrabold text-sm">Error</p>
                        <p className="text-red-700 text-sm mt-0.5">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 btn-secondary py-3">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading || !isAuthenticated}
                      className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        "Submit Report"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ─── FAQ CTA ─── */}
        <div className="mt-8 mb-10 p-6 rounded-2xl flex items-center gap-4" style={{ background: "#f7ede2" }}>
          <div>
            <p className="font-extrabold mb-1" style={{ color: "#1e3d30" }}>Questions about reporting?</p>
            <p className="text-sm mb-3" style={{ color: "#3d5a50" }}>Learn how the rescue process works and what to include in your report.</p>
            <Link to="/faq" className="btn-secondary text-sm py-2 px-5">Read FAQ →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
