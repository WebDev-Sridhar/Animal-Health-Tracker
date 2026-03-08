import { Helmet } from "react-helmet-async";

export default function ResponsiblePetOwnershipPage() {
  return (
    <>
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

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Responsible Pet Ownership
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Learn how to be a responsible pet owner in Tamil Nadu. Proper care,
            training, and commitment ensure your pet lives a healthy, happy life
            and contributes to animal welfare.
          </p>
        </section>

        {/* Core Responsibilities */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
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
              <div key={item.num} className="border-l-4 border-green-500 pl-4">
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
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Species-Specific Care Guidelines
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-lg">
                Dogs
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Exercise
                  </p>
                  <p className="text-sm text-slate-600">
                    30-60 minutes daily depending on breed. Large breeds need
                    more activity.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Training
                  </p>
                  <p className="text-sm text-slate-600">
                    Start early with positive reinforcement. Consistent rules
                    prevent behavioral issues.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Grooming
                  </p>
                  <p className="text-sm text-slate-600">
                    Regular brushing, nail trimming, and bathing based on coat
                    type.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Health
                  </p>
                  <p className="text-sm text-slate-600">
                    Vaccinations, heartworm prevention, and dental care are
                    crucial.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-lg">
                Cats
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-pink-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Environment
                  </p>
                  <p className="text-sm text-slate-600">
                    Indoor cats need enrichment: scratching posts, climbing
                    trees, and toys.
                  </p>
                </div>
                <div className="bg-pink-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Litter Box
                  </p>
                  <p className="text-sm text-slate-600">
                    Provide minimum one per cat. Keep clean, accessible, and
                    away from food.
                  </p>
                </div>
                <div className="bg-pink-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Socialization
                  </p>
                  <p className="text-sm text-slate-600">
                    Cats are independent but need regular interaction and
                    playtime.
                  </p>
                </div>
                <div className="bg-pink-50 p-3 rounded">
                  <p className="font-semibold text-sm text-slate-800 mb-2">
                    Health
                  </p>
                  <p className="text-sm text-slate-600">
                    Monitor for urinary issues, dental disease, and behavioral
                    changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Behavioral Responsibility */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Behavioral Responsibility
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              Responsible pet owners ensure their animals don't harm others or
              create disturbances:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  <strong>Control:</strong> Keep dogs on leash in public spaces.
                  Secure cats indoors or in enclosures.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  <strong>Noise:</strong> Train dogs to minimize excessive
                  barking. Prevent disturbance to neighbors.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  <strong>Waste Management:</strong> Always clean up after your
                  pet in public areas. Dispose responsibly.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  <strong>Aggression:</strong> Address aggressive behavior
                  immediately with professional help.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>
                  <strong>Legal Compliance:</strong> Follow local regulations
                  for pet licensing and vaccination.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Financial Responsibility */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Financial Planning for Pet Care
          </h2>
          <div className="space-y-4">
            <p className="text-slate-700">
              Responsible pet ownership requires financial commitment. Budget
              for:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Routine Expenses
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Quality pet food</li>
                  <li>• Veterinary checkups</li>
                  <li>• Vaccines and preventives</li>
                  <li>• Grooming supplies</li>
                  <li>• Toys and bedding</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Emergency Fund
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Unexpected illness treatment</li>
                  <li>• Emergency surgery</li>
                  <li>• Dental procedures</li>
                  <li>• Medication costs</li>
                  <li>• Pet insurance (optional)</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Monthly costs for a dog range from ₹2,000-5,000+; cats
              ₹1,500-3,000+. Plan accordingly before getting a pet.
            </p>
          </div>
        </section>

        {/* Long-term Commitment */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Long-Term Commitment
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>Owning a pet is a 10-15 year commitment. Consider:</p>
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded">
                <h3 className="font-semibold text-slate-800 mb-1">
                  Life Changes
                </h3>
                <p className="text-sm">
                  Plan for housing changes, job relocations, and family changes.
                  Your pet depends on stability.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded">
                <h3 className="font-semibold text-slate-800 mb-1">
                  Senior Pet Care
                </h3>
                <p className="text-sm">
                  Older pets need more medical care, special diets, and mobility
                  assistance. Budget and prepare.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded">
                <h3 className="font-semibold text-slate-800 mb-1">
                  End-of-Life Decisions
                </h3>
                <p className="text-sm">
                  Consider quality of life in aging pets. Plan for euthanasia
                  and burial/cremation with dignity.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded">
                <h3 className="font-semibold text-slate-800 mb-1">
                  Time Availability
                </h3>
                <p className="text-sm">
                  Pets need daily attention, exercise, and interaction. Ensure
                  you can provide this consistently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* When to Consider Rehoming */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            When Rehoming is the Responsible Choice
          </h2>
          <div className="space-y-3 text-slate-700 text-sm">
            <p>
              Sometimes, despite best efforts, caring for a pet becomes
              impossible. Responsible owners consider rehoming when:
            </p>
            <ul className="space-y-2">
              <li>• Financial hardship makes basic care impossible</li>
              <li>• Developing severe allergies</li>
              <li>• Moving to a pet-unfriendly location</li>
              <li>• Pet has behavioral issues requiring specialized care</li>
              <li>• Serious family illness or death in the family</li>
            </ul>
            <p className="mt-4">
              <strong>If rehoming:</strong> Contact shelters, rescue
              organizations, or trusted friends. Never abandon pets. Use
              OurPetCare to connect with adoption networks in Tamil Nadu.
            </p>
          </div>
        </section>

        {/* Community Responsibility */}
        <section className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Community and Societal Responsibility
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              Responsible pet owners contribute to animal welfare across Tamil
              Nadu:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">→</span>
                <span>Spay/neuter to control stray animal population</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">→</span>
                <span>
                  Report injured or abandoned animals through OurPetCare
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">→</span>
                <span>
                  Support animal welfare organizations and sanctuaries
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">→</span>
                <span>Educate others about proper pet care and adoption</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">→</span>
                <span>Never buy from unethical breeders; adopt instead</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Learn More About Pet Care</h2>
          <p className="mb-6 text-green-100">
            Join OurPetCare community for more tips, resources, and support for
            responsible pet ownership across Tamil Nadu.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50"
          >
            Back to Home
          </a>
        </section>
      </div>
    </>
  );
}
