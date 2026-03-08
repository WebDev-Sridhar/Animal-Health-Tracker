import { Helmet } from "react-helmet-async";

export default function PetCareTipsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <Helmet>
        <title>Pet Care Tips | Animal Rescue & Pet Adoption Guide</title>
        <meta
          name="description"
          content="Learn essential pet care tips including stray animal rescue, injured animal first aid, pet adoption guidance, and responsible pet ownership."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">
        Essential Pet Care Tips and Animal Rescue Guide
      </h1>

      <p className="mb-6 text-slate-600 leading-relaxed">
        Taking care of animals requires compassion, knowledge,
        and responsibility. At OurPetCare we encourage people to
        help injured animals, support stray animal rescue,
        and adopt pets responsibly.
      </p>

      {/* Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          How to Help an Injured Animal
        </h2>
        <p className="text-slate-600 leading-relaxed">
          If you find an injured dog or stray animal,
          stay calm and approach slowly. Many injured animals
          are frightened and may react defensively.
          Provide water if possible and contact local
          animal rescue volunteers.
        </p>
      </section>

      {/* Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          First Aid for Injured Dogs and Cats
        </h2>
        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Clean minor wounds with antiseptic solution.</li>
          <li>Stop bleeding using gentle pressure.</li>
          <li>Keep the animal warm and calm.</li>
          <li>Transport safely to a veterinarian or rescue center.</li>
        </ul>
      </section>

      {/* Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          Responsible Pet Adoption
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Pet adoption is a long-term commitment.
          Before adopting a dog or cat,
          ensure you can provide food,
          shelter, medical care, and love.
          Adopting rescued animals helps reduce
          stray animal populations and gives animals
          a second chance at life.
        </p>
      </section>

      {/* Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          Basic Pet Health Tips
        </h2>
        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Provide fresh water daily.</li>
          <li>Ensure balanced nutrition.</li>
          <li>Schedule regular veterinary checkups.</li>
          <li>Maintain vaccinations and parasite control.</li>
        </ul>
      </section>

    </div>
  );
}