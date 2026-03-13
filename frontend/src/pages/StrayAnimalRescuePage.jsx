import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function StrayAnimalRescuePage() {
  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Stray Animal Rescue Guide | OurPetCare - Tamil Nadu</title>
        <meta name="description" content="Complete guide to rescuing injured stray animals in Tamil Nadu. Learn how to safely help homeless dogs, cats, and other animals with OurPetCare." />
        <meta name="keywords" content="stray animal rescue, injured dog rescue, homeless animals, pet rescue guide, animal welfare Tamil Nadu" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
        <div className="text-5xl mb-3">🐕</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
          Stray Animal Rescue Guide
        </h1>
        <p className="text-teal-100 text-lg max-w-2xl mx-auto">
          Learn how to safely identify, approach, and rescue injured or distressed stray animals across Tamil Nadu.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

        {/* Before You Rescue */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Before You Rescue: Safety First
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              Rescuing stray animals requires preparation and caution. Whether
              you encounter an injured dog, cat, or other animal on the streets
              of Chennai, Coimbatore, or any Tamil Nadu district, follow these
              safety guidelines:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
              <li>Wear protective gear including gloves and closed shoes</li>
              <li>Assess the animal's condition before approaching</li>
              <li>Stay calm to keep the animal from panicking</li>
              <li>Be aware of traffic and surrounding hazards</li>
              <li>Never corner or trap a frightened animal</li>
              <li>Bring treats or food to gain trust</li>
              <li>Have a carrier, blanket, or leash readily available</li>
            </ul>
          </div>
        </section>

        {/* Signs of Distress */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Identifying Injured or Distressed Animals
          </h2>
          <div className="space-y-4">
            <p className="text-slate-700">
              Know the warning signs that indicate an animal needs immediate
              help:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Critical Signs
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Visible bleeding or injuries</li>
                  <li>• Unable to walk or move</li>
                  <li>• Signs of weakness or collapse</li>
                  <li>• Difficult breathing</li>
                  <li>• Severe limping</li>
                </ul>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Warning Signs
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Excessive scratching or swelling</li>
                  <li>• Discharge from eyes or nose</li>
                  <li>• Limping or favoring a limb</li>
                  <li>• Behavioral changes (aggression)</li>
                  <li>• Malnutrition or dehydration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Rescue */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Step-by-Step Rescue Process
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Assess the Situation",
                desc: "Evaluate the animal's condition and surrounding environment. Check for vehicular traffic, aggressive other animals, or hazards.",
              },
              {
                step: "2",
                title: "Approach Slowly",
                desc: "Move calmly and slowly toward the animal. Speak in soft, soothing tones. Avoid sudden movements that could startle them.",
              },
              {
                step: "3",
                title: "Offer Food or Water",
                desc: "If the animal is conscious and alert, offer water or treats. This builds trust and shows you mean no harm.",
              },
              {
                step: "4",
                title: "Use Containment",
                desc: "Gently place a blanket over the animal if needed. Use a pet carrier, leash, or net to safely contain them.",
              },
              {
                step: "5",
                title: "Transport Safely",
                desc: "Keep the animal calm during transport. Minimize noise and stress. Secure them in a carrier or box with proper ventilation.",
              },
              {
                step: "6",
                title: "Seek Medical Help",
                desc: "Contact a veterinary hospital immediately. In Tamil Nadu, use OurPetCare to report the animal for professional help.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Scenarios */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Handling Common Rescue Scenarios
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Injured Dog</h3>
              <p className="text-slate-600 text-sm">
                Use a leash or slip collar to control the animal. Be cautious of
                bites, especially if the dog is in pain. Look for wounds,
                fractures, or signs of infection. Transport immediately to the
                nearest veterinary clinic.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Frightened Cat
              </h3>
              <p className="text-slate-600 text-sm">
                Cats are more likely to scratch when scared. Wear protective
                gloves and use a blanket to gently contain them. Place in a
                secure carrier with small air holes. Cats often hide when
                injured, check bushes and covered areas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Animals Hit by Vehicles
              </h3>
              <p className="text-slate-600 text-sm">
                These emergency cases require immediate veterinary care.
                Stabilize the animal without moving them excessively. Use a
                rigid board or blanket as a stretcher. Call emergency veterinary
                services immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Poisoned Animals
              </h3>
              <p className="text-slate-600 text-sm">
                Signs include excessive drooling, vomiting, or seizures.
                Transport immediately to a veterinary hospital. If possible,
                identify the poison (pesticide, toxic plant, etc.) to help
                treatment.
              </p>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Emergency Resources in Tamil Nadu
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-700">
            <div>
              <h3 className="font-semibold mb-2">24/7 Emergency Help</h3>
              <p className="text-sm">
                Contact OurPetCare to report injured animals. We connect you
                with local veterinary clinics and animal welfare organizations
                across Tamil Nadu.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Local Animal Shelters</h3>
              <p className="text-sm">
                If you rescue an animal but cannot provide immediate care,
                contact local animal shelters and NGOs working for animal
                welfare in your district.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Veterinary Support</h3>
              <p className="text-sm">
                Many veterinary clinics offer emergency services. Keep contact
                numbers of nearby hospitals and clinics for quick reference
                during emergencies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-sm">
                Join OurPetCare community to connect with animal lovers,
                volunteers, and rescue networks dedicated to helping animals
                across Tamil Nadu.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="card p-10 text-center" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
          <div className="text-4xl mb-3">🐾</div>
          <h2 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Help Save Animals Today
          </h2>
          <p className="mb-6 text-teal-100 max-w-md mx-auto">
            Have you spotted an injured animal? Report it immediately through
            OurPetCare and connect with rescue networks across Tamil Nadu.
          </p>
          <Link to="/report"
            className="inline-block px-8 py-3 rounded-full font-extrabold text-teal-700 bg-white hover:bg-teal-50 transition-all hover:scale-105">
            Report an Animal Now
          </Link>
        </section>
      </div>
    </div>
  );
}
