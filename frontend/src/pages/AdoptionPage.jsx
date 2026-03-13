import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

export default function AdoptionPage() {
  const [allAnimals, setAllAnimals] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur",
    "Dindigul", "Karur", "Kanchipuram",
  ];

  const categories = ["dog", "cat", "bird", "goat", "cow"];

  useEffect(() => { fetchAnimals(); }, []);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/reports/adoptions");
      setAllAnimals(res.data);
      setAnimals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = allAnimals;
    if (district) result = result.filter((a) => a.zone?.toLowerCase().includes(district.toLowerCase()));
    if (category) result = result.filter((a) => a.animal?.species?.toLowerCase() === category);
    setAnimals(result);
  }, [district, category, allAnimals]);

  const conditionBadge = (condition) => {
    const map = {
      healthy: "badge-green", injured: "badge-orange", sick: "badge-red",
      aggressive: "badge-red", "vaccination-needed": "badge-amber",
      critical: "badge-red", "for-adoption": "badge-teal",
    };
    return map[condition] || "badge-teal";
  };

  const speciesEmoji = (species) => {
    const map = { dog: "🐕", cat: "🐈", bird: "🦜", goat: "🐐", cow: "🐄" };
    return map[species?.toLowerCase()] || "🐾";
  };

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Adopt Pets in Tamil Nadu | OurPetCare</title>
        <meta name="description" content="Find rescued animals available for adoption across Tamil Nadu on OurPetCare." />
      </Helmet>

      {/* ─── Hero Banner ─── */}
      <section className="relative md:h-96 overflow-hidden ">
        <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center text-white px-6 " style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }} >
          <span className="badge mb-4" style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "0.4rem 1.1rem" }}>
            Pet Adoption
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
            Find Your Forever Friend
          </h1>
          <p className="text-lg max-w-xl" style={{ color: "#f7ede2" }}>
            Every rescued animal deserves a loving home. Browse, connect, and adopt.
          </p>
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm" style={{ borderBottom: "1px solid #edddd0" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
          <span className="text-sm font-extrabold text-gray-600 mr-1">Filter:</span>
          <select className="input-field max-w-xs py-2.5 text-sm cursor-pointer" value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="">All Districts</option>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select className="input-field max-w-xs py-2.5 text-sm cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Animals</option>
            {categories.map((c) => <option key={c}>{speciesEmoji(c)} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          {(district || category) && (
            <button onClick={() => { setDistrict(""); setCategory(""); }}
              className="text-sm font-bold underline underline-offset-2 transition-colors" style={{ color: "#3d8c78" }}>
              Clear
            </button>
          )}
          <div className="ml-auto text-sm text-gray-500 font-semibold">
            {animals.length} pet{animals.length !== 1 ? "s" : ""} available
          </div>
        </div>
      </section>

      {/* ─── Cards Grid ─── */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-24">
              <div className="text-center">
                <div className="w-14 h-14 border-4 rounded-full animate-spin mx-auto mb-4"
                  style={{ borderColor: "#d0ece5", borderTopColor: "#3d8c78" }} />
                <p className="text-gray-600 font-semibold text-lg">Finding animals near you...</p>
              </div>
            </div>
          ) : animals.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-24">
              <div className="text-center">
                <div className="text-7xl mb-4">🐾</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', cursive" }}>No pets found</h3>
                <p className="text-gray-500">{allAnimals.length === 0 ? "Check back soon — new animals are added daily." : "Try adjusting your filters."}</p>
                {(district || category) && (
                  <button onClick={() => { setDistrict(""); setCategory(""); }} className="mt-4 btn-secondary text-sm py-2 px-5">
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            animals.map((r, i) => {
              const lat = r.location?.coordinates?.[1];
              const lng = r.location?.coordinates?.[0];
              const mapsUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;
              const whatsappUrl = r.reportedBy?.phone ? `https://wa.me/${r.reportedBy.phone}` : null;

              return (
                <div key={r._id} className="card card-lift overflow-hidden fade-in-up" style={{ animationDelay: `${(i % 6) * 0.07}s` }}>
                  {/* Image */}
                  <div className="relative overflow-hidden h-56">
                    {r.photo ? (
                      <img src={r.photo} alt={r.animal?.species}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl"
                        style={{ background: "linear-gradient(135deg, #eaf5f1, #d0ece5)" }}>
                        {speciesEmoji(r.animal?.species)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`badge ${conditionBadge(r.condition)} shadow-sm`}>
                        {r.condition?.replace("-", " ")}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge" style={{ background: "rgba(0,0,0,0.5)", color: "white", fontSize: "0.7rem" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 capitalize" style={{ fontFamily: "'Fredoka', cursive" }}>
                        {speciesEmoji(r.animal?.species)} {r.animal?.species || "Animal"}
                      </h3>
                      <p className="text-sm text-gray-500">📍 {r.zone || "Tamil Nadu"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-gray-400 font-semibold uppercase tracking-wide">Age</p>
                        <p className="font-bold text-gray-700 mt-0.5">{r.animal?.approxAge || "Unknown"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-gray-400 font-semibold uppercase tracking-wide">Vaccine</p>
                        <p className="font-bold text-gray-700 mt-0.5 truncate">{r.animal?.vaccinationStatus || "Unknown"}</p>
                      </div>
                    </div>

                    {r.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{r.description}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2.5">
                      <Link to={`/pet/${r._id}`} className="block w-full text-center btn-primary text-sm py-2.5">
                        View Full Details
                      </Link>
                      {r.reportedBy?.phone && (
                        <div className="grid grid-cols-2 gap-2">
                          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105"
                            style={{ background: "#25D366" }}>
                            WhatsApp
                          </a>
                          <a href={`tel:${r.reportedBy.phone}`}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-extrabold text-white transition-all hover:scale-105"
                            style={{ background: "#3d8c78" }}>
                            Call
                          </a>
                        </div>
                      )}
                      {mapsUrl && (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-extrabold transition-colors"
                          style={{ color: "#2e6b5a", background: "#eaf5f1" }}>
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ─── Why Adopt Section ─── */}
      <section className="py-16 px-6" style={{ background: "#f7ede2" }}>
        <div className="max-w-5xl mx-auto card p-10 md:p-14">
          <div className="text-center mb-10">
            <span className="section-tag">Why Adopt?</span>
            <h2 className="text-4xl" style={{ fontFamily: "'Fredoka', cursive" }}>
              Give a Rescue Animal a Second Chance
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Save a Life", desc: "Adoption gives a homeless animal the chance to live in a safe, loving environment." },
              { title: "Stronger Bonds", desc: "Adopted animals often form deep, lasting bonds out of gratitude and trust." },
              { title: "Health Checked", desc: "All listed animals are health monitored. Many come vaccinated and treated by volunteers." },
              { title: "Community Impact", desc: "Every adoption reduces Tamil Nadu's stray population and supports ethical animal care." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl" style={{ background: "#eaf5f1" }}>
                <h4 className="font-bold mb-1" style={{ fontFamily: "'Fredoka', cursive", color: "#1e3d30" }}>{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="btn-secondary text-sm px-6 py-3">Read Adoption FAQ →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
