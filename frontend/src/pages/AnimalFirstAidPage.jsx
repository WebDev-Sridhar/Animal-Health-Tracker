import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function AnimalFirstAidPage() {
  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Animal First Aid Tips | OurPetCare - Tamil Nadu</title>
        <meta name="description" content="Emergency first aid guide for injured animals. Learn CPR, wound care, and how to handle common pet injuries and emergencies in Tamil Nadu." />
        <meta name="keywords" content="animal first aid, pet emergency care, dog CPR, cat injuries, first aid for pets, animal emergency treatment" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)" }}>
        <div className="relative z-10">
          <div className="text-5xl mb-3">🩹</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
            Animal First Aid Tips
          </h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">
            Learn essential first aid techniques to save an injured animal's life. Quick action during
            emergencies can make all the difference.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

        {/* Emergency Action Plan */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Emergency Action Plan (ABCD)
          </h2>
          <div className="space-y-4">
            {[
              {
                letter: "A",
                title: "Airway",
                desc: "Check if the animal can breathe. Clear any obstruction from mouth. Check for chest movement."
              },
              {
                letter: "B",
                title: "Breathing",
                desc: "If not breathing, perform rescue breathing. For dogs/cats: close mouth, breathe into nose every 5-10 seconds."
              },
              {
                letter: "C",
                title: "Circulation",
                desc: "Check for pulse (inside hind leg). If no pulse, perform chest compressions at 100-120 per minute."
              },
              {
                letter: "D",
                title: "Disability Assessment",
                desc: "Check consciousness level and pupil response. Move to veterinary care immediately."
              }
            ].map((item) => (
              <div key={item.letter} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className="shrink-0 w-12 h-12 bg-red-600 rounded-lg text-white flex items-center justify-center font-bold text-lg">
                  {item.letter}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wound Care */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Treating Wounds and Bleeding
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 ">Minor Wounds</h3>
              <ol className="text-sm text-slate-600 space-y-1 ml-4">
                <li>1. Clean the area with cool, clean water</li>
                <li>2. Use mild antiseptic soap if available</li>
                <li>3. Pat dry with clean cloth</li>
                <li>4. Apply antibiotic ointment if available</li>
                <li>5. Cover with loose bandage</li>
                <li>6. Monitor for infection (discharge, swelling, heat)</li>
              </ol>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-slate-800 mb-2 ">Severe Bleeding</h3>
              <ol className="text-sm text-slate-600 space-y-1 ml-4">
                <li>1. Apply direct pressure with clean cloth</li>
                <li>2. DO NOT remove cloth; add layers if soaked</li>
                <li>3. Elevate the limb if possible</li>
                <li>4. Apply pressure for 10-15 minutes continuously</li>
                <li>5. Once bleeding slows, wrap with bandage</li>
                <li>6. Seek veterinary care immediately</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Fractures and Injuries */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Handling Fractures and Joint Injuries
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              If an animal has a suspected fracture or joint injury:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="font-bold" style={{ color: "#3d8c78" }}>→</span>
                <span>
                  <strong>Immobilize:</strong> Prevent movement of the injured limb using a makeshift splint
                  (rolled newspaper, cardboard, or cushioning)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold" style={{ color: "#3d8c78" }}>→</span>
                <span>
                  <strong>Support:</strong> Use a sling or wrap to restrict movement during transport
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold" style={{ color: "#3d8c78" }}>→</span>
                <span>
                  <strong>Ice:</strong> Apply ice pack wrapped in cloth for 15 minutes to reduce swelling
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold" style={{ color: "#3d8c78" }}>→</span>
                <span>
                  <strong>Elevation:</strong> Keep limb elevated to minimize bleeding and swelling
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold" style={{ color: "#3d8c78" }}>→</span>
                <span>
                  <strong>X-ray:</strong> Veterinary X-ray is essential to confirm fracture location and severity
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Poisoning and Toxins */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Poisoning and Toxic Exposure
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Signs of Poisoning</h3>
              <div className="bg-red-50 p-3 rounded text-sm text-slate-700 space-y-1">
                <p>• Vomiting or diarrhea</p>
                <p>• Seizures or tremors</p>
                <p>• Excessive drooling</p>
                <p>• Difficulty breathing</p>
                <p>• Loss of consciousness</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">What to Do</h3>
              <ol className="text-sm text-slate-600 space-y-1 ml-4">
                <li>1. Remove animal from the source of poison</li>
                <li>2. Take a sample of toxic substance (packaging, plant, etc.)</li>
                <li>3. Do NOT induce vomiting unless instructed by veterinarian</li>
                <li>4. Keep animal calm and warm</li>
                <li>5. Transport immediately to veterinary hospital</li>
                <li>6. Call poison control or veterinarian for guidance</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 ">Common Toxins</h3>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Pesticides and rat poison</li>
                <li>• Chocolate, xylitol, grapes, onions</li>
                <li>• Medications (paracetamol, aspirin)</li>
                <li>• Plants (lilies, sago palm, oleander)</li>
                <li>• Antifreeze and cleaning chemicals</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Heat and Cold Stress */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Heat Stress and Heatstroke
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Signs of Heatstroke</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Excessive panting</li>
                <li>• Drooling and weakness</li>
                <li>• Glazed eyes</li>
                <li>• Staggering</li>
                <li>• Elevated body temperature greater than 40°C</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Emergency Treatment</h3>
              <ol className="text-sm text-slate-600 space-y-1">
                <li>1. Move to cool, shaded area</li>
                <li>2. Apply cool water to body</li>
                <li>3. Offer small amounts of water</li>
                <li>4. Do NOT use ice (causes shock)</li>
                <li>5. Seek veterinary care immediately</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Medical Kit */}
        <section className="card p-7">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            Build a Pet First Aid Kit
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Essential Items</h3>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Sterile gauze and bandages</li>
                <li>• Antibiotic ointment</li>
                <li>• Thermometer</li>
                <li>• Scissors and tweezers</li>
                <li>• Cotton balls and alcohol</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Important Documents</h3>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Veterinarian contact numbers</li>
                <li>• Emergency clinic addresses</li>
                <li>• Medical history records</li>
                <li>• Vaccination certificates</li>
                <li>• Insurance details (if available)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* When to Seek Help */}
        <section className="p-7 rounded-2xl border-l-4" style={{ background: "#fff1f2", borderColor: "#ef4444" }}>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
            When to Seek Veterinary Care (CRITICAL)
          </h2>
          <p className="text-slate-700 mb-4">
            Seek immediate veterinary care for any of these emergencies:
          </p>
          <ul className="grid md:grid-cols-2 gap-3 text-slate-700">
            <li>✗ Difficulty breathing or choking</li>
            <li>✗ Uncontrolled bleeding</li>
            <li>✗ Seizures or unconsciousness</li>
            <li>✗ Suspected fracture or paralysis</li>
            <li>✗ Suspected poisoning</li>
            <li>✗ Signs of severe abdominal pain</li>
            <li>✗ Inability to urinate or defecate</li>
            <li>✗ Signs of heatstroke</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="card p-10 text-center" style={{ background: "linear-gradient(135deg, #2e6b5a 0%, #3d8c78 100%)" }}>
          <div className="text-4xl mb-3">🚨</div>
          <h2 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>Emergency? Report Now</h2>
          <p className="mb-6 max-w-md mx-auto" style={{ color: "#f7ede2" }}>
            Found an injured animal? Use OurPetCare to report immediately and connect with emergency volunteers in Tamil Nadu.
          </p>
          <Link to="/report"
            className="inline-block px-8 py-3 rounded-full font-extrabold bg-white transition-all hover:scale-105"
            style={{ color: "#2e6b5a" }}>
            Report Emergency Now
          </Link>
        </section>
      </div>
    </div>
  );
}
