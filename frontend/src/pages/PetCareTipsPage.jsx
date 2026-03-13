import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const TIPS = [
  {
    icon: "🤕",
    title: "How to Help an Injured Animal",
    color: "",
    colorStyle: { background: "#fdf6d0", border: "2px solid #f0c030" },
    iconBg: "",
    iconBgStyle: { background: "linear-gradient(to bottom right, #f0c030, #d4a828)" },
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        If you find an injured dog or stray animal, stay calm and approach slowly.
        Many injured animals are frightened and may react defensively.
        Provide water if possible and contact local animal rescue volunteers.
        Report the animal immediately on OurPetCare so a volunteer can help.
      </p>
    ),
  },
  {
    icon: "🩹",
    title: "First Aid for Injured Dogs and Cats",
    color: "bg-red-50 border-red-100",
    iconBg: "from-red-400 to-red-500",
    content: (
      <ul className="space-y-2.5">
        {[
          "Clean minor wounds with antiseptic solution.",
          "Stop bleeding using gentle, firm pressure.",
          "Keep the animal warm and as calm as possible.",
          "Do not move if spinal injury is suspected.",
          "Transport safely to a veterinarian or rescue center.",
        ].map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-gray-600 text-sm">
            <span className="text-[#3d8c78] font-extrabold mt-0.5">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: "🏡",
    title: "Responsible Pet Adoption",
    color: "",
    colorStyle: { background: "#eaf5f1", border: "2px solid #b0ddd3" },
    iconBg: "",
    iconBgStyle: { background: "linear-gradient(to bottom right, #3d8c78, #2e6b5a)" },
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Pet adoption is a long-term commitment. Before adopting a dog or cat,
        ensure you can provide food, shelter, medical care, and love.
        Adopting rescued animals helps reduce stray animal populations and gives
        animals a second chance at life. Always adopt from verified rescuers.
      </p>
    ),
  },
  {
    icon: "💊",
    title: "Basic Pet Health Tips",
    color: "bg-blue-50 border-blue-100",
    iconBg: "from-blue-400 to-blue-500",
    content: (
      <ul className="space-y-2.5">
        {[
          "Provide fresh, clean water every day.",
          "Feed age-appropriate, balanced nutrition.",
          "Schedule regular veterinary checkups (at least yearly).",
          "Maintain vaccinations and parasite control.",
          "Spay or neuter to prevent overpopulation.",
        ].map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-gray-600 text-sm">
            <span className="text-[#3d8c78] font-extrabold mt-0.5">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: "🏃",
    title: "Exercise and Mental Health",
    color: "bg-green-50 border-green-100",
    iconBg: "from-green-500 to-green-600",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Dogs need 30–60 minutes of daily exercise depending on their breed.
        Cats benefit greatly from interactive play sessions with toys.
        Regular physical activity and mental stimulation prevent obesity,
        anxiety, and destructive behaviors in pets.
      </p>
    ),
  },
  {
    icon: "🛁",
    title: "Grooming and Hygiene",
    color: "bg-purple-50 border-purple-100",
    iconBg: "from-purple-400 to-purple-500",
    content: (
      <ul className="space-y-2.5">
        {[
          "Brush your pet's coat regularly to prevent matting.",
          "Trim nails every 3–4 weeks to avoid discomfort.",
          "Clean ears gently to prevent infections.",
          "Bathe dogs monthly or as needed.",
          "Brush teeth with pet-safe toothpaste.",
        ].map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-gray-600 text-sm">
            <span className="text-[#3d8c78] font-extrabold mt-0.5">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    ),
  },
];

export default function PetCareTipsPage() {
  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Pet Care Tips | Animal Rescue & Pet Adoption Guide</title>
        <meta name="description" content="Learn essential pet care tips including stray animal rescue, injured animal first aid, pet adoption guidance, and responsible pet ownership." />
      </Helmet>

      {/* ─── Hero ─── */}
      <section className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="absolute top-4 left-8 text-3xl opacity-20 float-anim">🐾</div>
        <div className="absolute bottom-4 right-8 text-2xl opacity-20 float-anim" style={{ animationDelay: "1s" }}>🐾</div>
        <div className="relative z-10">
          <div className="text-5xl mb-3">💡</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
            Essential Pet Care Tips
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#f7ede2" }}>
            Everything you need to know to help injured animals, care for your pets, and adopt responsibly.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {TIPS.map((tip, i) => (
            <div key={tip.title} className={`card card-lift p-7 border-2 ${tip.color} fade-in-up`}
              style={{ animationDelay: `${i * 0.08}s`, ...(tip.colorStyle || {}) }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tip.iconBg} flex items-center justify-center mb-5 shadow-md text-3xl`}
                style={tip.iconBgStyle || {}}>
                {tip.icon}
              </div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                {tip.title}
              </h2>
              {tip.content}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 card p-10 text-center" style={{ background: "linear-gradient(135deg, #2e6b5a, #3d8c78)" }}>
          <div className="text-5xl mb-4">🚨</div>
          <h2 className="text-3xl font-bold mb-3 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Found an Injured Animal?
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: "#f7ede2" }}>
            Don't hesitate — use OurPetCare to report the animal and get help from a nearby volunteer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/report"
              className="px-8 py-3 rounded-full font-extrabold bg-white hover:bg-[#eaf5f1] transition-all hover:scale-105 text-sm" style={{ color: "#2e6b5a" }}>
              Report an Animal
            </Link>
            <Link to="/animalfirstaid"
              className="px-8 py-3 rounded-full font-extrabold text-white border-2 border-white/50 hover:bg-white/15 transition-all hover:scale-105 text-sm">
              First Aid Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
