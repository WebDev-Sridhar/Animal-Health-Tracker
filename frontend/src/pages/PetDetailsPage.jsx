import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

function PetDetailsPage() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
     const res = await apiClient.get(`/reports/${id}`);
      setPet(res.data.data);
    };

    fetchPet();
  }, [id]);

  if (!pet) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        Loading pet details...
      </div>
    );
  }

  const lat = pet.location?.coordinates?.[1];
  const lng = pet.location?.coordinates?.[0];

  const mapsUrl =
    lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;

  const whatsappUrl = pet.reportedBy?.phone
    ? `https://wa.me/${pet.reportedBy.phone}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* SEO */}
      <Helmet>
        <title>
          Adopt {pet.animal?.species || "Pet"} in {pet.zone} | OurPetCare
        </title>

        <meta
          name="description"
          content={`Adopt a rescued ${pet.animal?.species} in ${pet.zone}. Learn about the pet's health, vaccination status, and contact the rescuer on OurPetCare.`}
        />
      </Helmet>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Image */}
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          {pet.photo ? (
            <img
              src={pet.photo}
              alt="Pet"
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">

          <h1 className="text-2xl font-bold text-slate-800">
            {pet.animal?.species} Available for Adoption
          </h1>

          <p className="text-slate-500">
            Posted in {pet.zone || "Tamil Nadu"} on{" "}
            {new Date(pet.createdAt).toLocaleDateString()}
          </p>

          <div className="space-y-2 text-sm text-slate-600">

            <p>
              <span className="font-medium text-slate-800">
                Species:
              </span>{" "}
              {pet.animal?.species}
            </p>

            <p>
              <span className="font-medium text-slate-800">
                Approx Age:
              </span>{" "}
              {pet.animal?.approxAge || "Unknown"}
            </p>

            <p>
              <span className="font-medium text-slate-800">
                Vaccination Status:
              </span>{" "}
              {pet.animal?.vaccinationStatus || "Unknown"}
            </p>

            <p>
              <span className="font-medium text-slate-800">
                Health Condition:
              </span>{" "}
              {pet.condition}
            </p>

            <p>
              <span className="font-medium text-slate-800">
                Location:
              </span>{" "}
              {pet.zone}
            </p>
          </div>

          {/* Contact Buttons */}

          <div className="flex gap-3 pt-4">

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-green-500 text-white rounded-lg py-2 hover:bg-green-600"
              >
                WhatsApp
              </a>
            )}

            {pet.reportedBy?.phone && (
              <a
                href={`tel:${pet.reportedBy.phone}`}
                className="flex-1 text-center bg-green-700 text-white rounded-lg py-2 hover:bg-green-800"
              >
                Call Rescuer
              </a>
            )}

          </div>

          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center border border-slate-300 rounded-lg py-2 hover:bg-slate-100"
            >
              Get Directions
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <section className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-3">
          About this Pet
        </h2>

        <p className="text-slate-600 leading-relaxed">
          {pet.description ||
            "This rescued animal is currently looking for a safe and loving home. The pet has been reported by a community member who wants to help find responsible adopters. OurPetCare connects rescuers and adopters across Tamil Nadu to improve animal welfare and reduce the number of stray animals."}
        </p>

      </section>

      {/* Adoption Guide */}
      <section className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          How to Adopt This Pet
        </h2>

        <ul className="list-disc pl-6 text-slate-600 space-y-2">

          <li>Contact the rescuer using WhatsApp or phone.</li>

          <li>Ask about the pet’s health and behavior.</li>

          <li>Visit the pet location if possible.</li>

          <li>Ensure you have proper space and resources to care for the pet.</li>

          <li>Commit to responsible pet ownership.</li>

        </ul>

      </section>

      {/* Pet Care Tips */}
      <section className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Pet Care Tips for New Owners
        </h2>

        <p className="text-slate-600 mb-3">
          Adopting a rescued pet is a rewarding experience. Ensure that your
          home environment is safe and welcoming for the animal.
        </p>

        <ul className="list-disc pl-6 text-slate-600 space-y-2">

          <li>Provide proper food and fresh water.</li>

          <li>Schedule regular veterinary checkups.</li>

          <li>Keep vaccinations up to date.</li>

          <li>Provide daily exercise and mental stimulation.</li>

          <li>Show patience and care as the pet adjusts to its new home.</li>

        </ul>

      </section>

      {/* Animal Welfare Section */}
      <section className="bg-white border rounded-xl shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Why Adopt Rescued Animals?
        </h2>

        <p className="text-slate-600 leading-relaxed">
          Animal adoption helps reduce stray animal populations and provides
          abandoned animals with loving homes. By adopting instead of buying
          pets, you support ethical animal care and help communities manage
          stray animals responsibly.
        </p>

      </section>

    </div>
  );
}

export default PetDetailsPage;