import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiClient } from "../api/client";

function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await apiClient.get(`/reports/${id}`);
        setPet(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Pet not found</p>
          <button
            onClick={() => navigate("/adoption")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Adoption
          </button>
        </div>
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

  const getConditionColor = (condition) => {
    const colors = {
      healthy: "bg-green-100 text-green-800",
      injured: "bg-orange-100 text-orange-800",
      sick: "bg-red-100 text-red-800",
      aggressive: "bg-red-100 text-red-800",
      "vaccination-needed": "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
      "for-adoption": "bg-blue-100 text-blue-800",
    };
    return colors[condition] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
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

      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate("/adoption")}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition mb-4 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Adoption
          </button>
          <h1 className="text-4xl font-bold mb-2">{pet.animal?.species?.toUpperCase()}</h1>
          <p className="text-blue-100 text-lg">Available for Adoption in {pet.zone}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* Left: Image */}
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              {pet.photo ? (
                <img
                  src={pet.photo}
                  alt="Pet"
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="h-96 flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-500">No Image Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit sticky top-8">
            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getConditionColor(pet.condition)}`}>
                {pet.condition?.replace("-", " ").toUpperCase()}
              </span>
            </div>

            {/* Info Grid */}
            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-slate-500 text-sm uppercase tracking-wide">Species</p>
                <p className="text-xl font-bold text-slate-800 capitalize">{pet.animal?.species}</p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-slate-500 text-sm uppercase tracking-wide">Age</p>
                <p className="text-xl font-bold text-slate-800">{pet.animal?.approxAge || "Unknown"}</p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-slate-500 text-sm uppercase tracking-wide">Vaccination</p>
                <p className="text-xl font-bold text-slate-800">{pet.animal?.vaccinationStatus || "Unknown"}</p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-slate-500 text-sm uppercase tracking-wide">Location</p>
                <p className="text-xl font-bold text-slate-800">{pet.zone}</p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-slate-500 text-sm uppercase tracking-wide">Posted</p>
                <p className="text-xl font-bold text-slate-800">{new Date(pet.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.036-4.988 5.074-4.988 8.353 0 1.36.264 2.703.754 3.964l1.321 3.057-3.537-1.137c-1.074-.643-2.038-1.571-2.847-2.71C.654 15.07 0 12.62 0 10.07 0 5.495 3.505 1.76 8.232 1.76c1.563 0 3.07.384 4.474 1.107 3.075 1.614 5.23 4.565 5.23 8.005 0 .93-.12 1.861-.353 2.749-1.487 4.49-5.595 7.712-10.88 7.712-.95 0-1.885-.122-2.799-.356l-3.06.987 1.142-2.628c-.6-1.507-.923-3.118-.923-4.78 0-5.18 3.505-9.513 8.232-9.513 1.562 0 3.07.385 4.474 1.107 3.075 1.614 5.23 4.565 5.23 8.005 0 .93-.12 1.86-.353 2.748-1.487 4.49-5.595 7.713-10.88 7.713z" />
                  </svg>
                  WhatsApp
                </a>
              )}

              {pet.reportedBy?.phone && (
                <a
                  href={`tel:${pet.reportedBy.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  Call Reporter
                </a>
              )}

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                  </svg>
                  Get Directions
                </a>
              )}
            </div>
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
    </div>
  );
}

export default PetDetailsPage;

