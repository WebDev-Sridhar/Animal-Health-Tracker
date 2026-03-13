import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MapComponent from "../components/MapComponent";
import { animalsApi } from "../api/animals";
import { apiClient } from "../api/client";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
const DEFAULT_RADIUS = 10000;

const STATS = [
  { icon: "🐕", value: "2,400+", label: "Animals Rescued" },
  { icon: "📋", value: "5,800+", label: "Reports Submitted" },
  { icon: "🏡", value: "1,200+", label: "Pets Adopted" },
  { icon: "🤝", value: "800+", label: "Volunteers Active" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📸",
    title: "Report",
    desc: "Spot an injured or stray animal? Submit a quick report with a photo and location from anywhere in Tamil Nadu.",
    borderColor: "#f0e8d8",
    iconStyle: { background: "linear-gradient(135deg, #f6bd60, #e6a83c)" },
  },
  {
    step: "02",
    icon: "🚑",
    title: "Rescue",
    desc: "Our network of trained volunteers receives your report and rushes to help the animal get care and treatment.",
    borderColor: "#d4e4e1",
    iconStyle: { background: "linear-gradient(135deg, #84a59d, #6b8c85)" },
  },
  {
    step: "03",
    icon: "🏡",
    title: "Adopt",
    desc: "Once healthy, rescued animals are listed for adoption. Find your perfect companion and give them a forever home.",
    borderColor: "#fde68a",
    iconStyle: { background: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
  },
];

const PET_TIPS = [
  { icon: "💉", title: "Keep Vaccinations Updated", desc: "Regular vaccinations protect your pet from rabies, parvovirus, and other diseases. Schedule yearly vet visits.", bg: "#f0f5f4" },
  { icon: "🥗", title: "Balanced Nutrition", desc: "Feed age-appropriate food in measured portions. Avoid table scraps and toxic foods like onions and chocolate.", bg: "#fdf3de" },
  { icon: "🏃", title: "Daily Exercise", desc: "Dogs need 30–60 min walks daily. Cats benefit from play sessions. Physical activity prevents obesity and stress.", bg: "#fef3c7" },
];

const TESTIMONIALS = [
  {
    name: "Priya Raman",
    role: "Pet Adopter, Chennai",
    avatar: "P",
    avatarStyle: { background: "#d4e4e1", color: "#6b8c85" },
    text: "Found the most adorable rescued indie dog through OurPetCare. The process was smooth and the volunteer who rescued him was so caring. Bruno is now the joy of our household!",
  },
  {
    name: "Karthik Murugan",
    role: "Volunteer, Coimbatore",
    avatar: "K",
    avatarStyle: { background: "#fdf3de", color: "#c4892a" },
    text: "Being a volunteer here has been incredibly rewarding. The platform makes it so easy to manage rescues in my zone. I've helped over 30 animals find safety this year alone.",
  },
  {
    name: "Deepa Shankar",
    role: "Reporter, Madurai",
    avatar: "D",
    avatarStyle: { background: "#fef3c7", color: "#b45309" },
    text: "I reported an injured street dog using the app and within 3 hours a volunteer was there. The dog got treatment and is now healthy and adopted. Amazing community work!",
  },
];

export default function HomePage() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [featuredPets, setFeaturedPets] = useState([]);

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
        if (err.message?.includes("401") || err.message?.toLowerCase().includes("authorized")) {
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

  useEffect(() => {
    apiClient.get("/reports/adoptions")
      .then((res) => setFeaturedPets((res.data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>OurPetCare - Animal Health Tracker in Tamil Nadu</title>
        <meta name="description" content="Track animal health, report animal welfare concerns, and adopt rescued pets across Tamil Nadu with OurPetCare." />
      </Helmet>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-10 pb-20">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1444212477490-ca407925329e?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Happy dog in nature"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(56, 68, 65, 0.88) 0%, rgba(60, 88, 81, 0.55) 60%, rgba(22, 23, 22, 0.3) 100%)" }} />

        {/* Floating paw prints */}
        <div className="absolute top-16 left-10 text-4xl opacity-15 float-anim" style={{ animationDelay: "0s" }}>🐾</div>
        <div className="absolute top-32 right-16 text-3xl opacity-15 float-anim" style={{ animationDelay: "1s" }}>🐾</div>
        <div className="absolute bottom-24 left-20 text-2xl opacity-15 float-anim" style={{ animationDelay: "2s" }}>🐾</div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white fade-in-up">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
            <span>🐾</span>
            <span>Animal Rescue Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight"
            style={{ fontFamily: "'Fredoka', cursive"}}>
            Helping Animals Get
            <br />
            <span style={{ color: "#f6bd60" }}>Rescued, Treated</span>
            <br />
            & Adopted
          </h1>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Join thousands of compassionate volunteers protecting animals across Tamil Nadu.
            Report injured animals, track health, and find loving forever homes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report" className="btn-orange text-base px-8 py-4">
              Report Injured Animal
            </Link>
            <Link
              to="/adoption"
              className="text-base px-8 py-4 rounded-full font-extrabold transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", color: "white", border: "2.5px solid rgba(255,255,255,0.5)" }}
            >
              Adopt a Pet
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center p-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-extrabold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>{s.value}</div>
                <div className="text-xs text-white/80 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60">
          <span className="text-xs font-semibold">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-tag">How It Works</span>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Fredoka', cursive" }}>
              Three Steps to Save a Life
            </h2>
            <p className="text-gray-500 mt-3 text-lg max-w-xl mx-auto">
              Our streamlined process makes it easy for anyone to help animals in need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, #84a59d, transparent)" }} />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="card card-lift p-8 border-2 text-center fade-in-up" style={{ animationDelay: `${i * 0.15}s`, borderColor: step.borderColor }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg" style={step.iconStyle}>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="text-xs font-extrabold text-gray-400 tracking-widest uppercase mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-2xl mb-3" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pet Health Map ─── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #f0f5f4 0%, #e8f0ee 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-tag">Live Map</span>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Fredoka', cursive" }}>
              Animal Health Map
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Real-time tracking of reported animals near your location across Tamil Nadu.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderBottom: "1px solid #d4e4e1" }}>
              <div>
                <p className="font-bold text-gray-700">{animals.length} animals reported near you</p>
                <p className="text-sm text-gray-500">Showing results within 10km radius</p>
              </div>
              <div className="flex gap-3">
                <Link to="/report" className="btn-orange text-sm py-2 px-5">
                  + Report Sighting
                </Link>
              </div>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            <div className="relative p-4">
              {loading && (
                <div className="absolute inset-4 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#d4e4e1", borderTopColor: "#84a59d" }} />
                    <p className="text-gray-600 font-semibold">Loading animal health map...</p>
                    <p className="text-gray-400 text-sm">Detecting your location</p>
                  </div>
                </div>
              )}
              <div className="rounded-2xl overflow-hidden shadow-inner">
                <MapComponent
                  center={center}
                  animals={animals}
                  height="480px"
                  onMarkerClick={setSelectedAnimal}
                />
              </div>
            </div>

            {/* Legend */}
            <div className="px-6 pb-5 flex flex-wrap gap-3 justify-center">
              {[
                { color: "bg-green-500", label: "Healthy" },
                { color: "bg-purple-600", label: "Sick" },
                { color: "bg-amber-500", label: "Injured" },
                { color: "bg-red-500", label: "Critical" },
                { color: "bg-red-600", label: "Aggressive" },
                { color: "bg-blue-500", label: "For Adoption" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-xs font-semibold text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Adoption Pets ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-tag">Featured Pets</span>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Fredoka', cursive" }}>
              Animals Looking for a Home 
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              These rescued animals are healthy and ready to find their forever families.
            </p>
          </div>

          {featuredPets.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {featuredPets.map((pet, i) => (
                <div key={pet._id} className="card card-lift overflow-hidden fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  {pet.photo ? (
                    <img src={pet.photo} alt={pet.animal?.species} className="w-full h-52 object-cover" />
                  ) : (
                    <div className="w-full h-52 flex items-center justify-center text-5xl"
                      style={{ background: "linear-gradient(135deg, #f0f5f4, #d4e4e1)" }}>
                      {pet.animal?.species === "cat" ? "🐱" : pet.animal?.species === "dog" ? "🐶" : "🐾"}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-extrabold text-gray-800 capitalize text-lg"
                        style={{ fontFamily: "'Fredoka', cursive" }}>
                        {pet.animal?.species || "Animal"}
                      </span>
                      <span className="badge badge-teal">{pet.condition || "for-adoption"}</span>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                      <p>{pet.zone || "Tamil Nadu"}</p>
                      <p>{pet.animal?.vaccinationStatus || "Unknown"}</p>
                      <p>{new Date(pet.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link to={`/pet/${pet._id}`} className="block text-center btn-primary text-sm py-2.5">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { emoji: "🐕", name: "Indie Dog", zone: "Chennai", tag: "Healthy", bg: "linear-gradient(135deg, #3d8c78, #2e6b5a)" },
                { emoji: "🐈", name: "Rescue Cat", zone: "Coimbatore", tag: "For Adoption", bg: "linear-gradient(135deg, #f0c030, #d4a828)" },
                { emoji: "🐩", name: "Street Puppy", zone: "Madurai", tag: "Vaccinated", bg: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
              ].map((pet, i) => (
                <div key={i} className="card card-lift overflow-hidden fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-full h-52 flex items-center justify-center" style={{ background: pet.bg }}>
                    <span className="text-7xl">{pet.emoji}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-extrabold text-gray-800 text-lg" style={{ fontFamily: "'Fredoka', cursive" }}>{pet.name}</span>
                      <span className="badge badge-teal">{pet.tag}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4"> {pet.zone}</p>
                    <Link to="/adoption" className="block text-center btn-primary text-sm py-2.5">
                      Browse Pets
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/adoption" className="btn-secondary text-base px-8 py-3.5">
              View All Adoption Listings →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Animal Health Awareness ─── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 50%, #2e6b5a 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-5"
                style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                Health Tracking
              </span>
              <h2 className="text-4xl md:text-5xl mb-6 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
                Animal Health & Disease Monitoring
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "#f7ede2" }}>
                OurPetCare tracks animal health conditions across Tamil Nadu using real-time reports. Our system monitors disease outbreaks, zoonotic risks, and animal welfare trends to help communities respond faster.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time health status tracking by zone",
                  "Zoonotic disease risk score monitoring",
                  "Vaccination status awareness",
                  "Admin analytics for health response teams",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3" style={{ color: "#f7ede2" }}>
                    <span className="mt-0.5 font-extrabold" style={{ color: "#f0c030" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Disease Monitoring", desc: "Track health patterns across zones" },
                { label: "Vaccination Tracking", desc: "Monitor vaccine coverage rates" },
                { label: "Zone Risk Scores", desc: "Identify high-risk locations" },
                { label: "Health Analytics", desc: "Data-driven welfare decisions" },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                  <div className="font-bold text-white text-sm mb-1">{item.label}</div>
                  <div className="text-xs" style={{ color: "#eaf5f1" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pet Care Tips Preview ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-tag section-tag-yellow">Pet Care</span>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Fredoka', cursive" }}>
              Quick Pet Care Tips 
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Keep your furry friends healthy and happy with these expert-backed tips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {PET_TIPS.map((tip, i) => (
              <div key={tip.title} className="card card-lift p-7 fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-md" style={{ background: tip.bg }}>
                  <span className="text-3xl">{tip.icon}</span>
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>{tip.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/petcaretips" className="btn-secondary text-base px-8 py-3.5">
              Read All Pet Care Tips →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Volunteer CTA ─── */}
      <section className="py-16 px-6" style={{ background: "#f7ede2" }}>
        <div className="max-w-5xl mx-auto">
          <div className="card p-10 md:p-14 text-center"
            style={{ background: "linear-gradient(135deg, #f0c030 0%, #d4a828 100%)" }}>
            <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "#1e3d30" }}>
              Join Our Volunteer Network
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "#2e6b5a" }}>
              Make a real difference in animals' lives. Volunteer rescuers get access to a dedicated dashboard to manage rescue missions in their zone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="px-8 py-4 rounded-full font-extrabold transition-all hover:scale-105 shadow-lg text-base"
                style={{ background: "white", color: "#2e6b5a" }}>
                Become a Volunteer
              </Link>
              <Link to="/strayanimalrescue"
                className="px-8 py-4 rounded-full font-extrabold transition-all hover:scale-105 text-base"
                style={{ color: "#1e3d30", border: "2px solid rgba(30,61,48,0.3)" }}>
                Learn About Rescue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-tag">Community Stories</span>
            <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Fredoka', cursive" }}>
              Stories That Warm the Heart 
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Real experiences from our community of adopters, volunteers, and reporters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="card p-7 fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg" style={t.avatarStyle}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="text-3xl mb-2" style={{ color: "#b0ddd3" }}>"</div>
                <p className="text-gray-600 text-sm leading-relaxed italic">{t.text}</p>
                <div className="mt-4 flex gap-0.5">
                  {Array(5).fill(0).map((_, si) => (
                    <span key={si} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ─── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #f7ede2 0%, #eaf5f1 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4"></div>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Spotted an Injured Animal?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Don't scroll past. A quick 2-minute report could save an animal's life. Our volunteers are ready to respond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report" className="btn-orange text-base px-10 py-4 pulse-glow">
              Report Now — It's Free
            </Link>
            <Link to="/animalfirstaid" className="btn-secondary text-base px-8 py-4">
              First Aid Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
