import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            OurPetCare
          </h2>
          <p className="text-sm leading-relaxed">
            OurPetCare is a community platform helping people
            <strong> report injured animals, rescue stray pets,
            and adopt rescued animals across Tamil Nadu.</strong>
            Together we can create a safer environment for animals.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-medium mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/report">Report Injured Animal</Link></li>
            <li><Link to="/adoption">Pet Adoption</Link></li>
            <li><Link to="/petcaretips">Pet Care Tips</Link></li>
          </ul>
        </div>

        {/* Helpful Resources */}
        <div>
          <h3 className="text-white font-medium mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/petcaretips">PetCare Tips</Link></li>
            <li><Link to="/strayanimalrescue">Stray Animal Rescue Guide</Link></li>
            <li><Link to="/petadoption">Pet Adoption Process</Link></li>
            <li><Link to="/animalfirstaid">Animal First Aid Tips</Link></li>
            <li><Link to="/responsiblepetownership">Responsible Pet Ownership</Link></li>

          </ul>
        </div>

        {/* SEO Content */}
        <div>
          <h3 className="text-white font-medium mb-3">
            Animal Welfare
          </h3>
          <p className="text-sm leading-relaxed">
            OurPetCare helps communities across India
            support animal welfare through
            <strong> stray animal rescue, pet adoption,
            injured animal reporting, and pet health awareness.</strong>
          </p>
        </div>

      </div>

      <div className="border-t border-slate-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} OurPetCare • Animal Rescue & Pet Adoption Platform
      </div>
    </footer>
  );
}