import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, #3a4a45 0%, #2d3a38 100%)" }} className="mt-0">

      {/* Top Wave */}
      <div className="overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full" style={{ fill: "#f7ede2" }}>
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-12 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <span className="text-xl">🐾</span>
            </div>
            <span className="text-xl font-extrabold text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
              OurPetCare
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#b8cfc9" }}>
            Tamil Nadu's community platform for reporting injured animals, rescuing strays, and helping pets find loving homes.
          </p>
   
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-extrabold mb-4 text-base text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/report", label: "Report Injured Animal" },
              { to: "/adoption", label: "Pet Adoption" },
              { to: "/petcaretips", label: "Pet Care Tips" },
              { to: "/faq", label: "FAQ" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-1.5 group transition-colors"
                  style={{ color: "#b8cfc9" }}>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span className="group-hover:text-white transition-colors">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-extrabold mb-4 text-base text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Resources
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/strayanimalrescue", label: "Stray Animal Rescue Guide" },
              { to: "/petadoption", label: "Pet Adoption Process" },
              { to: "/animalfirstaid", label: "Animal First Aid" },
              { to: "/responsiblepetownership", label: "Responsible Pet Ownership" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-1.5 group transition-colors"
                  style={{ color: "#b8cfc9" }}>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span className="group-hover:text-white transition-colors">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Animal Welfare */}
        <div>
          <h3 className="font-extrabold mb-4 text-base text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Animal Welfare
          </h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "#b8cfc9" }}>
            OurPetCare supports communities across India with stray animal rescue, pet adoption, injury reporting, and health awareness.
          </p>
          <Link to="/report"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #f6bd60, #e6a83c)", color: "#3a4a45" }}>
            Report an Animal
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-5 text-center text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "#84a59d" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} OurPetCare • Animal Rescue & Pet Adoption Platform</p>
          <p className="text-xs" style={{ color: "#6b8c85" }}>Made with ❤️ for animals of Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
