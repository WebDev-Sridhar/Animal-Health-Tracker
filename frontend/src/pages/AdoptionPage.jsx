import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

export default function AdoptionPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const [filtered, setFiltered] = useState([]);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  const districts = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
    "Thoothukudi",
    "Thanjavur",
    "Dindigul",
    "Karur",
    "Kanchipuram",
  ];

  const categories = ["dog", "cat", "bird", "goat", "cow"];

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/reports/adoptions");
      //   console.log(res.data)
      setAnimals(res.data);
      //   setFiltered(adoptionAnimals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = animals;

    if (district) {
      result = result.filter((a) =>
        a.zone?.toLowerCase().includes(district.toLowerCase()),
      );
    }

    if (category) {
      result = result.filter(
        (a) => a.animal?.species?.toLowerCase() === category,
      );
    }

    setAnimals(result);
  }, [district, category, animals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Helmet>
        <title>Adopt Pets in Tamil Nadu | OurPetCare</title>
        <meta
          name="description"
          content="Find rescued animals available for adoption across Tamil Nadu on OurPetCare."
        />
      </Helmet>

      {/* Banner */}
      <div className="rounded-xl overflow-hidden mb-10">
        <img
          src="/img/adoptionBanner.jpeg"
          alt="Adopt pets"
          className="w-full h-auto md:h-100 md:object-cover"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">
          Animals Available For Adoption
        </h1>
        <p className="text-slate-500 mt-2">
          Give a loving home to animals rescued and reported by the community.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <select
          className="border rounded-lg px-4 py-2"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Animals</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 text-lg">Loading...</p>
            </div>
          </div>
        ) : animals.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-slate-600 text-lg font-medium">
                No pets available for adoption
              </p>
              <p className="text-slate-500 mt-2">
                Check back later or adjust your filters
              </p>
            </div>
          </div>
        ) : (
          animals.map((r) => {
            const lat = r.location?.coordinates?.[1];
            const lng = r.location?.coordinates?.[0];

            const mapsUrl =
              lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null;

            const whatsappUrl = r.reportedBy?.phone
              ? `https://wa.me/${r.reportedBy.phone}`
              : null;

            return (
              <div
                key={r._id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
              >
                {r.photo ? (
                  <img
                    src={r.photo}
                    alt="animal"
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="w-full h-60 bg-slate-100 flex items-center justify-center text-slate-400">
                    No Image Available
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-md text-slate-800">
                    Details
                  </h3>

                  <p className="text-sm text-slate-500">
                    <span className="text-slate-800">Species:</span>{" "}
                    {r.animal?.species}
                  </p>

                  <p className="text-sm text-slate-500">
                    <span className="text-slate-800">Age:</span>{" "}
                    {r.animal?.approxAge || "Unknown"}
                  </p>

                  <p className="text-sm text-slate-500">
                    <span className="text-slate-800">Vaccination:</span>{" "}
                    {r.animal?.vaccinationStatus || "Unknown"}
                  </p>

                  <p className="text-sm text-slate-500">
                    <span className="text-slate-800">Health:</span>{" "}
                    {r.condition}
                  </p>

                  <p className="text-sm text-slate-500">
                    <span className="text-slate-800">Description:</span>{" "}
                    {r.description || "No description provided."}
                  </p>

                  <p className="text-sm text-slate-400">
                    <span className="text-slate-800">Location:</span>{" "}
                    {r.zone || "Unknown"}
                  </p>

                  <p className="text-xs text-slate-400">
                    Posted: {new Date(r.createdAt).toLocaleDateString()}
                  </p>

                  {/* Get Directions */}
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 text-sm mt-2 hover:underline"
                    >
                      <svg
                        className="w-4 h-4 "
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Get Directions
                    </a>
                  )}

                  {/* Pet Details Page */}
                  <a
                    href={`/pet/${r._id}`}
                    className="block text-center border border-slate-300 text-slate-700 rounded-lg py-2 mt-3 hover:bg-slate-100"
                  >
                    Know more about the pet
                  </a>

                  {/* Contact Section */}
                  {r.reportedBy?.phone && (
                    <div className="flex gap-3 mt-2">
                      {/* WhatsApp */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white rounded-lg py-2"
                      >
                        WhatsApp
                      </a>

                      {/* Call */}
                      <a
                        href={`tel:${r.reportedBy.phone}`}
                        className="flex-1 text-center bg-green-700 hover:bg-green-800 text-white rounded-lg py-2"
                      >
                        Call Reporter
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Adoption Info Section */}
      <div className="mt-16 bg-slate-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Why Adopt a Pet?
        </h2>

        <p className="text-slate-600 mb-4">
          Adoption saves lives. Thousands of animals are rescued and reported
          every year. By adopting instead of buying, you provide a loving home
          to an animal that truly needs it.
        </p>

        <ul className="list-disc ml-6 text-slate-600 space-y-2">
          <li>Adoption reduces stray population.</li>
          <li>Adopted animals often form stronger bonds with owners.</li>
          <li>Rescue animals are vaccinated and health checked.</li>
          <li>You support ethical animal care.</li>
        </ul>

        <p className="text-slate-600 mt-4">
          <Link
            to="/faq"
            className="text-blue-600 font-semibold hover:text-blue-700 underline"
          >
            Learn more in our FAQ page
          </Link>
        </p>
      </div>
    </div>
  );
}
