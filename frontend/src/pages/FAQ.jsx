import { Helmet } from "react-helmet-async";
import { useState } from "react";

export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: "adoption-1",
      category: "Dog and Puppy Adoption",
      question: "Can I adopt a dog or puppy for free in India?",
      answer:
        "Yes. Many volunteers and animal rescue groups offer free dog adoption in India. Through OurPetCare, you can find rescued dogs and puppies that need safe homes. Most rescues provide free or low-cost adoption to encourage people to give animals loving homes.",
    },
    {
      id: "adoption-2",
      category: "Dog and Puppy Adoption",
      question: "How can I adopt a puppy online?",
      answer:
        "You can browse animals listed for puppy adoption online on OurPetCare. Each listing includes information about the pet, photos, health status, and contact details for the rescuer. Simply browse available puppies, submit an adoption application, and connect with the rescuer who can answer your questions.",
    },
    {
      id: "adoption-3",
      category: "Dog and Puppy Adoption",
      question: "Where can I adopt rescued dogs in Tamil Nadu?",
      answer:
        "OurPetCare connects people with rescuers across Tamil Nadu who help stray animals find loving homes. You can adopt rescued dogs listed by volunteers and community members throughout all districts in Tamil Nadu. Our platform makes it easy to find and connect with dogs available for adoption.",
    },
    {
      id: "adoption-4",
      category: "Dog and Puppy Adoption",
      question: "Is puppy adoption really free?",
      answer:
        "Most rescues offer free puppy adoption to encourage adoption over purchasing. However, some volunteers may request small contributions for vaccinations, food, medical care, or transport costs. These contributions support the rescue work and ensure the puppy is healthy before going to its new home.",
    },
    {
      id: "adoption-5",
      category: "Dog and Puppy Adoption",
      question: "Why should I adopt a rescued dog instead of buying one?",
      answer:
        "Adopting a rescued dog helps reduce stray animal populations and supports animal welfare. It also gives abandoned animals a second chance to live in a loving home. Rescued dogs are often already vaccinated and healthy. Most importantly, adoption saves a life and reduces demand for unethical breeding.",
    },
    {
      id: "reporting-1",
      category: "Reporting Injured Animals",
      question: "How can I report an injured animal?",
      answer:
        "If you see an injured stray animal, you can report it through OurPetCare by going to the Report page. Provide details about the animal's location, condition, type of animal, and any injuries you notice. Include a photo if possible. Your report helps volunteers and rescuers locate the animal and provide medical help.",
    },
    {
      id: "reporting-2",
      category: "Reporting Injured Animals",
      question: "What happens after I report an injured animal?",
      answer:
        "Once a report is submitted, volunteers or rescue organizations review the report and respond to help the animal if resources are available. The assignment system connects available volunteers with the report. Volunteers can update the status as they work to rescue and treat the animal.",
    },
    {
      id: "reporting-3",
      category: "Reporting Injured Animals",
      question: "Can I report injured stray dogs in Tamil Nadu?",
      answer:
        "Yes. OurPetCare allows people to report injured stray dogs and other animals across Tamil Nadu, helping rescuers identify animals that need urgent care. You can specify the exact location using geolocation, describe the injury, and even upload photos to help rescuers locate and help the animal quickly.",
    },
    {
      id: "health-1",
      category: "Animal Health and Safety",
      question: "What is animal health risk tracking?",
      answer:
        "Animal health risk tracking helps monitor diseases that can affect animals and humans. OurPetCare provides information about potential risks and helps raise awareness in communities. This includes tracking disease outbreaks, vaccination status, and health concerns that could impact animal welfare across Tamil Nadu.",
    },
    {
      id: "health-2",
      category: "Animal Health and Safety",
      question: "How does OurPetCare help animal welfare?",
      answer:
        "OurPetCare supports animal welfare by allowing people to report injured animals, adopt rescued pets, and share important animal health information. Our platform connects compassionate people with rescue networks, provides educational resources, and helps coordinate efforts to protect animal health and safety throughout Tamil Nadu.",
    },
  ];

  const categories = [
    "Dog and Puppy Adoption",
    "Reporting Injured Animals",
    "Animal Health and Safety",
  ];

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Dog Adoption, Animal Rescue | OurPetCare Tamil Nadu</title>
        <meta
          name="description"
          content="Frequently asked questions about dog adoption, puppy adoption, animal rescue, and injured animal reporting in Tamil Nadu. Get answers on pet adoption, animal welfare."
        />
        <meta
          name="keywords"
          content="dog adoption FAQ, puppy adoption, free dog adoption India, animal rescue Tamil Nadu, injured animal reporting, pet adoption questions"
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about dog adoption, puppy adoption,
            animal rescue, and injured animal reporting in Tamil Nadu through
            OurPetCare.
          </p>
        </section>

        {/* Category Navigation */}
        <section className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition"
            >
              {category}
            </button>
          ))}
        </section>

        {/* FAQ Items */}
        <section className="space-y-4">
          {categories.map((category) => (
            <div key={category}>
              {/* Category Heading */}
              <h2 className="text-2xl font-bold text-slate-800 mb-4 mt-8 pb-3 border-b-2 border-blue-200">
                {category}
              </h2>

              {/* FAQ for this category */}
              <div className="space-y-3">
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-start justify-between hover:bg-slate-50 transition"
                      >
                        <h3 className="text-lg font-semibold text-slate-800 flex-1">
                          {faq.question}
                        </h3>
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold ml-4 transition-transform ${
                            expandedId === faq.id ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {/* Answer */}
                      {expandedId === faq.id && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                          <p className="text-slate-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
            Couldn't find the answer you're looking for? We're here to help.
            Connect with our community or reach out through OurPetCare for more
            information about adoption, animal rescue, or reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/adoption"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Browse Animals
            </a>
            <a
              href="/report"
              className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Report an Animal
            </a>
          </div>
        </section>

        {/* Info Box */}
        <section className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
          <h3 className="font-semibold text-slate-800 mb-2">
            About OurPetCare
          </h3>
          <p className="text-slate-700 text-sm">
            OurPetCare is a community platform helping people report injured
            animals, rescue stray pets, and adopt rescued animals across Tamil
            Nadu. We connect compassionate volunteers with animals in need and
            support animal welfare through awareness and coordinated rescue
            efforts.
          </p>
        </section>
      </div>
    </>
  );
}
