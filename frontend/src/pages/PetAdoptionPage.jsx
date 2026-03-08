import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function PetAdoptionPage() {
  return (
    <>
      <Helmet>
        <title>Pet Adoption Process | OurPetCare - Adopt in Tamil Nadu</title>
        <meta
          name="description"
          content="Complete guide to adopting rescued animals in Tamil Nadu. Learn the adoption process, requirements, and costs to give a loving home to a stray animal."
        />
        <meta
          name="keywords"
          content="pet adoption, adopt dogs, adopt cats, stray animal adoption, rescue adoption, pet adoption process Tamil Nadu"
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Pet Adoption Process
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Give a loving home to a rescued animal. Learn how to adopt a dog,
            cat, or other pet through OurPetCare and make a difference in a
            stray animal's life across Tamil Nadu.
          </p>
        </section>

        {/* Why Adopt */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Why Adopt a Rescued Animal?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-slate-800 mb-2">Save a Life</h3>
              <p className="text-slate-600 text-sm">
                Thousands of stray dogs, cats, and animals in Tamil Nadu need
                loving homes. Adoption directly saves a life and makes space for
                rescuing more animals.
              </p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-slate-800 mb-2">
                Better Mental Health
              </h3>
              <p className="text-slate-600 text-sm">
                Adopted animals often show gratitude and bonding. They provide
                unconditional love and companionship, improving your mental and
                physical wellbeing.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-slate-800 mb-2">
                Health Screened
              </h3>
              <p className="text-slate-600 text-sm">
                Rescued animals are typically vaccinated and checked by
                veterinarians before adoption, ensuring they're healthy and safe
                for your family.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-slate-800 mb-2">
                Support Animal Welfare
              </h3>
              <p className="text-slate-600 text-sm">
                Adoption fees support animal rescue organizations, veterinary
                care, and shelters working to end animal suffering across Tamil
                Nadu.
              </p>
            </div>
          </div>
        </section>

        {/* Adoption Steps */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Step-by-Step Adoption Process
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Browse Available Animals",
                desc: "Visit OurPetCare to browse dogs, cats, and other animals available for adoption. Filter by district, species, and age to find the perfect match.",
              },
              {
                step: "2",
                title: "Learn About the Animal",
                desc: "Check medical history, personality traits, age, and special needs. Photos and videos help you understand the animal's temperament and behavior.",
              },
              {
                step: "3",
                title: "Submit Adoption Application",
                desc: "Complete our adoption form with your details, living situation, family information, and experience with pets. This ensures proper placement.",
              },
              {
                step: "4",
                title: "Application Review",
                desc: "Our team reviews your application to ensure you're a suitable match for the animal. We may contact you for additional information.",
              },
              {
                step: "5",
                title: "Meet the Animal",
                desc: "Visit the shelter or location to spend time with your potential new family member. This helps ensure compatibility and builds the bond.",
              },
              {
                step: "6",
                title: "Complete Adoption Agreement",
                desc: "Sign the adoption agreement which outlines responsibilities, care standards, and return policies if circumstances change.",
              },
              {
                step: "7",
                title: "Pay Adoption Fee",
                desc: "Complete payment for the adoption fee. Fees typically cover vaccinations, medical care, and shelter expenses.",
              },
              {
                step: "8",
                title: "Welcome Home",
                desc: "Take your new pet home! We provide care guides and post-adoption support. Join our community for ongoing advice and fellowship.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold">
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

        {/* Adoption Requirements */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Adoption Requirements
          </h2>
          <div className="space-y-4 text-slate-700">
            <p>
              To ensure the best home for our animals, we have basic adoption
              requirements:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  <strong>Age:</strong> Adopters must be at least 18 years old
                  with a valid ID
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  <strong>Residence:</strong> You must provide a permanent
                  address or proof of residence
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  <strong>Housing:</strong> Suitable living space for the animal
                  (house, flat, or apartment)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  <strong>Financial Capacity:</strong> Ability to provide food,
                  shelter, and veterinary care
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  <strong>Commitment:</strong> Willingness to care for the
                  animal for its entire life
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">✓</span>
                <span>
                  <strong>References:</strong> Optional but helpful - references
                  from veterinarians or community members
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Adoption Costs */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Adoption Fees & What They Include
          </h2>
          <div className="space-y-4">
            <p className="text-slate-700">
              Adoption fees vary by animal and location, but typically range
              from ₹500 to ₹3,000. These fees support animal rescue, veterinary
              care, and shelter operations.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-3">
                Adoption Fee Includes:
              </h3>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                <li>✓ Vaccination (if applicable)</li>
                <li>✓ Health checkup</li>
                <li>✓ Deworming treatment</li>
                <li>✓ Microchipping</li>
                <li>✓ Collar and leash</li>
                <li>✓ One month pet food supply</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Preparation Guide */}
        <section className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Preparing Your Home for a New Pet
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Essential Supplies
              </h3>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Food and water bowls</li>
                <li>• Pet bed or crate</li>
                <li>• Collar, leash, and ID tag</li>
                <li>• Toys and enrichment items</li>
                <li>• Litter box (for cats)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Home Safety</h3>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Secure all windows and balconies</li>
                <li>• Remove toxic plants and chemicals</li>
                <li>• Close doors to prevent escape</li>
                <li>• Protect electrical cords</li>
                <li>• Provide a safe space for the animal to adjust</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Veterinary Care
              </h3>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Find a nearby veterinary clinic</li>
                <li>• Schedule a post-adoption checkup</li>
                <li>• Keep medical records</li>
                <li>• Plan for vaccinations and preventive care</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Adjustment Tips */}
        <section className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Helping Your Adopted Pet Adjust
          </h2>
          <div className="space-y-3 text-slate-700">
            <p>
              Rescued animals may have had difficult experiences. Patience and
              love are key to helping them adjust:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">→</span>
                <span>Provide a quiet, safe space for the first few days</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">→</span>
                <span>Maintain consistent routines for food and exercise</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">→</span>
                <span>Use positive reinforcement and gentle training</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">→</span>
                <span>
                  Be patient with behavioral issues or trauma responses
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">→</span>
                <span>
                  Connect with other adopters in OurPetCare community for
                  support
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-purple-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Find Your Perfect Pet Today
          </h2>
          <p className="mb-6 text-purple-100">
            Browse animals available for adoption across Tamil Nadu and give a
            loving home to a rescued dog, cat, or other pet.
          </p>
          <Link
            to="/adoption"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50"
          >
            Browse Available Pets
          </Link>
        </section>
      </div>
    </>
  );
}
