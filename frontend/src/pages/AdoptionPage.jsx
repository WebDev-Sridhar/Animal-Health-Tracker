import { useEffect, useState } from "react";
import { apiClient } from '../api/client';

export default function AdoptionPage() {
  const [animals, setAnimals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  const districts = [
    "Chennai","Coimbatore","Madurai","Trichy","Salem","Tirunelveli","Erode",
    "Vellore","Thoothukudi","Thanjavur","Dindigul","Karur","Kanchipuram"
  ];

  const categories = [
    "dog","cat","bird","goat","cow","fish"
  ];

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const res = await apiClient.get("/reports");
      const adoptionAnimals = res.data.filter(
        (r) => r.condition === "for-adoption"
      );
      setAnimals(adoptionAnimals);
      setFiltered(adoptionAnimals);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let result = animals;

    if (district) {
      result = result.filter((a) =>
        a.zone?.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (category) {
      result = result.filter((a) =>
        a.animal?.species?.toLowerCase() === category
      );
    }

    setFiltered(result);
  }, [district, category, animals]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Banner */}
      <div className="rounded-xl overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
          alt="Adopt pets"
          className="w-full h-72 object-cover"
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

        {filtered.map((r) => (
          <div
            key={r._id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >
            <img
              src={r.photo}
              alt="animal"
              className="w-full h-48 object-cover"
            />

            <div className="p-4 space-y-2">

              <h3 className="font-semibold text-lg text-slate-800">
                {r.animal?.name || "Unnamed Animal"}
              </h3>

              <p className="text-sm text-slate-500">
                Species: {r.animal?.species}
              </p>

              <p className="text-sm text-slate-500">
                Age: {r.animal?.approxAge || "Unknown"}
              </p>

              <p className="text-sm text-slate-500">
                Vaccination: {r.animal?.vaccinationStatus || "Unknown"}
              </p>

              <p className="text-sm text-slate-500">
                Health: {r.condition}
              </p>

              <p className="text-sm text-slate-400">
                Location: {r.zone || "Unknown"}
              </p>

              <p className="text-xs text-slate-400">
                Posted: {new Date(r.createdAt).toLocaleDateString()}
              </p>

              {/* Contact Button */}
              {r.reportedBy?.phone && (
                <a
                  href={`tel:${r.reportedBy.phone}`}
                  className="block text-center bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 mt-3"
                >
                  Call Reporter
                </a>
              )}

            </div>
          </div>
        ))}

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

      </div>

    </div>
  );
}