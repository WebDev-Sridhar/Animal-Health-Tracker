import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiClient } from "../api/client";

function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await apiClient.get(`/reports/${id}`);
        setPet(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-gradient)" }}>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#d0ece5] border-t-[#3d8c78] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-gradient)" }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <p className="text-gray-600 text-lg mb-6 font-semibold">Pet not found</p>
          <button onClick={() => navigate("/adoption")} className="btn-primary">
            Back to Adoption
          </button>
        </div>
      </div>
    );
  }

  const lat = pet.location?.coordinates?.[1];
  const lng = pet.location?.coordinates?.[0];
  const mapsUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;
  const whatsappUrl = pet.reportedBy?.phone ? `https://wa.me/${pet.reportedBy.phone}` : null;

  const speciesEmoji = (s) => ({ dog: "🐕", cat: "🐈", bird: "🦜", goat: "🐐", cow: "🐄" }[s?.toLowerCase()] || "🐾");

  const conditionStyle = (condition) => {
    const map = {
      healthy: "badge-green", injured: "badge-orange", sick: "badge-red",
      aggressive: "badge-red", "vaccination-needed": "badge-amber",
      critical: "badge-red", "for-adoption": "badge-teal",
    };
    return map[condition] || "badge-teal";
  };

  return (
    <div className="overflow-x-hidden" style={{ background: "var(--bg-gradient)" }}>
      <Helmet>
        <title>Adopt {pet.animal?.species || "Pet"} in {pet.zone} | OurPetCare</title>
        <meta name="description" content={`Adopt a rescued ${pet.animal?.species} in ${pet.zone}. Learn about the pet's health, vaccination status, and contact the rescuer on OurPetCare.`} />
      </Helmet>

      {/* ─── Hero Header ─── */}
      <div className="relative py-10 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate("/adoption")}
            className="flex items-center gap-2 hover:text-white font-bold mb-6 transition-colors text-sm" style={{ color: "#f7ede2" }}>
            ← Back to Adoption
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              {speciesEmoji(pet.animal?.species)}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white capitalize" style={{ fontFamily: "'Fredoka', cursive" }}>
                {pet.animal?.species || "Animal"}
              </h1>
              <p className="text-lg" style={{ color: "#eaf5f1" }}>📍 Available for Adoption in {pet.zone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ─── Main Grid ─── */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left: Image */}
          <div className="md:col-span-2">
            <div className="card overflow-hidden shadow-xl">
              {pet.photo ? (
                <img src={pet.photo} alt="Pet" className="w-full h-[420px] object-cover" />
              ) : (
                <div className="h-[420px] flex items-center justify-center text-8xl"
                  style={{ background: "linear-gradient(135deg, #eaf5f1, #d0ece5)" }}>
                  {speciesEmoji(pet.animal?.species)}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card p-7 mt-6">
              <h2 className="text-2xl mb-4" style={{ fontFamily: "'Fredoka', cursive" }}>About this Pet 🐾</h2>
              <p className="text-gray-600 leading-relaxed">
                {pet.description || "This rescued animal is currently looking for a safe and loving home. The pet has been reported by a community member who wants to help find responsible adopters. OurPetCare connects rescuers and adopters across Tamil Nadu to improve animal welfare."}
              </p>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="space-y-5">
            {/* Status + Quick Info */}
            <div className="card p-7 sticky top-24">
              <div className="mb-5">
                <span className={`badge ${conditionStyle(pet.condition)} text-sm`}>
                  {pet.condition?.replace(/-/g, " ").toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 mb-7">
                {[
                  { label: "Species", value: pet.animal?.species, emoji: "🐾" },
                  { label: "Age", value: pet.animal?.approxAge || "Unknown", emoji: "📅" },
                  { label: "Vaccination", value: pet.animal?.vaccinationStatus || "Unknown", emoji: "💉" },
                  { label: "Location", value: pet.zone, emoji: "📍" },
                  { label: "Posted", value: new Date(pet.createdAt).toLocaleDateString(), emoji: "🗓️" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <span className="text-xl mt-0.5">{item.emoji}</span>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="font-bold text-gray-800 capitalize">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-extrabold text-white transition-all hover:scale-105 shadow-md"
                    style={{ background: "#25D366" }}>
                    💬 WhatsApp Rescuer
                  </a>
                )}
                {pet.reportedBy?.phone && (
                  <a href={`tel:${pet.reportedBy.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-extrabold text-white transition-all hover:scale-105 shadow-md"
                    style={{ background: "var(--primary)" }}>
                    📞 Call Rescuer
                  </a>
                )}
                {mapsUrl && (
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-extrabold transition-colors"
                    style={{ color: "#2e6b5a", background: "#eaf5f1" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#d0ece5"}
                    onMouseLeave={e => e.currentTarget.style.background = "#eaf5f1"}>
                    📍 Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Adoption Guide ─── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card p-7">
            <h2 className="text-2xl mb-5" style={{ fontFamily: "'Fredoka', cursive" }}>How to Adopt 🏡</h2>
            <ol className="space-y-3">
              {[
                "Contact the rescuer using WhatsApp or phone.",
                "Ask about the pet's health, behavior, and special needs.",
                "Arrange a safe meeting or visit the pet's location.",
                "Ensure you have space, time, and resources for the pet.",
                "Commit to responsible, lifelong pet ownership.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-extrabold text-white"
                    style={{ background: "var(--primary)" }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-7">
            <h2 className="text-2xl mb-5" style={{ fontFamily: "'Fredoka', cursive" }}>First-Week Pet Care 💡</h2>
            <ul className="space-y-3">
              {[
                "🥗 Provide proper food and fresh water daily",
                "🏥 Schedule a vet check in the first week",
                "💉 Keep vaccinations and deworming up to date",
                "🏃 Provide daily exercise and mental stimulation",
                "❤️ Be patient — rescued animals need time to adjust",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-gray-600 text-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Why Adoption Matters ─── */}
        <div className="card p-8" style={{ background: "#f7ede2" }}>
          <div className="flex items-start gap-5">
            <div className="text-5xl flex-shrink-0">🌍</div>
            <div>
              <h2 className="text-2xl mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>Why Adopt a Rescued Animal?</h2>
              <p className="text-gray-600 leading-relaxed">
                Animal adoption helps reduce stray animal populations and provides abandoned animals with loving homes.
                By adopting instead of buying pets, you support ethical animal care and help communities manage stray animals
                responsibly — making Tamil Nadu a safer, kinder place for all animals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetailsPage;
