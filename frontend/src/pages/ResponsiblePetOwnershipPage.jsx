import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function ResponsiblePetOwnershipPage() {
  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Responsible Pet Ownership | OurPetCare - Tamil Nadu</title>
        <meta
          name="description"
          content="Complete guide to responsible pet ownership. Learn how to properly care for dogs, cats, and other animals. Essential tips for pet health and welfare in Tamil Nadu."
        />
        <meta
          name="keywords"
          content="responsible pet ownership, pet care guide, dog care, cat care, pet health, animal welfare, pet responsibility"
        />
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
        <div className="text-5xl mb-3">🐾</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
          Responsible Pet Ownership
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "#f7ede2" }}>
          Learn how to be a responsible pet owner in Tamil Nadu. Proper care, training, and commitment ensure your pet lives a healthy, happy life and contributes to animal welfare.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

        {/* Core Responsibilities */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Core Responsibilities of Pet Ownership
          </h2>
          <div className="space-y-4">
            {[
              {
                num: "1",
                title: "Proper Nutrition",
                points: [
                  "Feed high-quality pet food appropriate for age and health",
                  "Provide fresh water daily",
                  "Follow portion guidelines to prevent obesity",
                  "Consult veterinarian about dietary needs",
                ],
              },
              {
                num: "2",
                title: "Healthcare",
                points: [
                  "Schedule regular veterinary checkups (annual minimum)",
                  "Keep vaccinations current",
                  "Treat parasites and worms regularly",
                  "Spay/neuter to prevent overpopulation",
                ],
              },
              {
                num: "3",
                title: "Exercise and Enrichment",
                points: [
                  "Provide daily physical exercise",
                  "Offer mental stimulation and play",
                  "Create safe space for exploration",
                  "Socialize pets with people and other animals",
                ],
              },
              {
                num: "4",
                title: "Training and Behavior",
                points: [
                  "Teach basic commands and house training",
                  "Use positive reinforcement methods",
                  "Address behavioral issues early",
                  "Never use harsh punishment or abuse",
                ],
              },
              {
                num: "5",
                title: "Safe Environment",
                points: [
                  "Pet-proof home to prevent accidents",
                  "Provide comfortable shelter and bedding",
                  "Ensure proper temperature control",
                  "Keep toxic substances out of reach",
                ],
              },
              {
                num: "6",
                title: "Identification and Control",
                points: [
                  "Microchip your pet for identification",
                  "Use collar and ID tag with contact info",
                  "Keep current photos for identification",
                  "Secure fencing for outdoor pets",
                ],
              },
            ].map((item) => (
              <div key={item.num} className="pl-4" style={{ borderLeft: "4px solid #3d8c78" }}>
                <h3 className="font-semibold text-slate-800 mb-2">
                  {item.num}. {item.title}
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  {item.points.map((point, idx) => (
                    <li key={idx}>• {point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Pet-Specific Care */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Species-Specific Care Guidelines
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-lg">Dogs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Exercise", desc: "30-60 minutes daily depending on breed. Large breeds need more activity." },
                  { title: "Training", desc: "Start early with positive reinforcement. Consistent rules prevent behavioral issues." },
                  { title: "Grooming", desc: "Regular brushing, nail trimming, and bathing based on coat type." },
                  { title: "Health", desc: "Vaccinations, heartworm prevention, and dental care are crucial." },
                ].map((item) => (
                  <div key={item.title} className="p-3 rounded-xl" style={{ background: "#eaf5f1" }}>
                    <p className="font-semibold text-sm text-slate-800 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-lg">Cats</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Environment", desc: "Indoor cats need enrichment: scratching posts, climbing trees, and toys." },
                  { title: "Litter Box", desc: "Provide minimum one per cat. Keep clean, accessible, and away from food." },
                  { title: "Socialization", desc: "Cats are independent but need regular interaction and playtime." },
                  { title: "Health", desc: "Monitor for urinary issues, dental disease, and behavioral changes." },
                ].map((item) => (
                  <div key={item.title} className="p-3 rounded-xl" style={{ background: "#fdf6d0" }}>
                    <p className="font-semibold text-sm text-slate-800 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Behavioral Responsibility */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Behavioral Responsibility
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>Responsible pet owners ensure their animals don't harm others or create disturbances:</p>
            <ul className="space-y-3">
              {[
                { label: "Control", desc: "Keep dogs on leash in public spaces. Secure cats indoors or in enclosures." },
                { label: "Noise", desc: "Train dogs to minimize excessive barking. Prevent disturbance to neighbors." },
                { label: "Waste Management", desc: "Always clean up after your pet in public areas. Dispose responsibly." },
                { label: "Aggression", desc: "Address aggressive behavior immediately with professional help." },
                { label: "Legal Compliance", desc: "Follow local regulations for pet licensing and vaccination." },
              ].map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="font-bold" style={{ color: "#3d8c78" }}>✓</span>
                  <span><strong>{item.label}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Financial Responsibility */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Financial Planning for Pet Care
          </h2>
          <div className="space-y-4">
            <p className="text-slate-700">Responsible pet ownership requires financial commitment. Budget for:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: "#eaf5f1" }}>
                <h3 className="font-semibold text-slate-800 mb-2">Routine Expenses</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Quality pet food</li>
                  <li>• Veterinary checkups</li>
                  <li>• Vaccines and preventives</li>
                  <li>• Grooming supplies</li>
                  <li>• Toys and bedding</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "#fdf6d0" }}>
                <h3 className="font-semibold text-slate-800 mb-2">Emergency Fund</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Unexpected illness treatment</li>
                  <li>• Emergency surgery</li>
                  <li>• Dental procedures</li>
                  <li>• Medication costs</li>
                  <li>• Pet insurance (optional)</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Monthly costs for a dog range from ₹2,000-5,000+; cats ₹1,500-3,000+. Plan accordingly before getting a pet.
            </p>
          </div>
        </section>

        {/* Long-term Commitment */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Long-Term Commitment
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>Owning a pet is a 10-15 year commitment. Consider:</p>
            <div className="space-y-3">
              {[
                { title: "Life Changes", desc: "Plan for housing changes, job relocations, and family changes. Your pet depends on stability." },
                { title: "Senior Pet Care", desc: "Older pets need more medical care, special diets, and mobility assistance. Budget and prepare." },
                { title: "End-of-Life Decisions", desc: "Consider quality of life in aging pets. Plan for euthanasia and burial/cremation with dignity." },
                { title: "Time Availability", desc: "Pets need daily attention, exercise, and interaction. Ensure you can provide this consistently." },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When to Consider Rehoming */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            When Rehoming is the Responsible Choice
          </h2>
          <div className="space-y-3 text-slate-700 text-sm">
            <p>Sometimes, despite best efforts, caring for a pet becomes impossible. Responsible owners consider rehoming when:</p>
            <ul className="space-y-2">
              <li>• Financial hardship makes basic care impossible</li>
              <li>• Developing severe allergies</li>
              <li>• Moving to a pet-unfriendly location</li>
              <li>• Pet has behavioral issues requiring specialized care</li>
              <li>• Serious family illness or death in the family</li>
            </ul>
            <p className="mt-4">
              <strong>If rehoming:</strong> Contact shelters, rescue organizations, or trusted friends. Never abandon pets. Use OurPetCare to connect with adoption networks in Tamil Nadu.
            </p>
          </div>
        </section>

        {/* Community Responsibility */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Community and Societal Responsibility
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>Responsible pet owners contribute to animal welfare across Tamil Nadu:</p>
            <ul className="space-y-2">
              {[
                "Spay/neuter to control stray animal population",
                "Report injured or abandoned animals through OurPetCare",
                "Support animal welfare organizations and sanctuaries",
                "Educate others about proper pet care and adoption",
                "Never buy from unethical breeders; adopt instead",
              ].map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="font-bold" style={{ color: "#3d8c78" }}>→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="card p-10 text-center" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
          <div className="text-4xl mb-3">💚</div>
          <h2 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Learn More About Pet Care
          </h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: "#f7ede2" }}>
            Join OurPetCare community for more tips, resources, and support for responsible pet ownership across Tamil Nadu.
          </p>
          <Link to="/"
            className="inline-block px-8 py-3 rounded-full font-extrabold bg-white transition-all hover:scale-105"
            style={{ color: "#2e6b5a" }}
            onMouseEnter={e => e.currentTarget.style.background = "#eaf5f1"}
            onMouseLeave={e => e.currentTarget.style.background = "white"}>
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
}
