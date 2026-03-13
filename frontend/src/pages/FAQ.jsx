import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const faqs = [
    {
      id: "adoption-1",
      category: "Dog and Puppy Adoption",
      categoryEmoji: "🐶",
      question: "Can I adopt a dog or puppy for free in India?",
      answer: "Yes. Many volunteers and animal rescue groups offer free dog adoption in India. Through OurPetCare, you can find rescued dogs and puppies that need safe homes. Most rescues provide free or low-cost adoption to encourage people to give animals loving homes.",
    },
    {
      id: "adoption-2",
      category: "Dog and Puppy Adoption",
      categoryEmoji: "🐶",
      question: "How can I adopt a puppy online?",
      answer: "You can browse animals listed for puppy adoption online on OurPetCare. Each listing includes information about the pet, photos, health status, and contact details for the rescuer. Simply browse available puppies, submit an adoption application, and connect with the rescuer who can answer your questions.",
    },
    {
      id: "adoption-3",
      category: "Dog and Puppy Adoption",
      categoryEmoji: "🐶",
      question: "Where can I adopt rescued dogs in Tamil Nadu?",
      answer: "OurPetCare connects people with rescuers across Tamil Nadu who help stray animals find loving homes. You can adopt rescued dogs listed by volunteers and community members throughout all districts in Tamil Nadu. Our platform makes it easy to find and connect with dogs available for adoption.",
    },
    {
      id: "adoption-4",
      category: "Dog and Puppy Adoption",
      categoryEmoji: "🐶",
      question: "Is puppy adoption really free?",
      answer: "Most rescues offer free puppy adoption to encourage adoption over purchasing. However, some volunteers may request small contributions for vaccinations, food, medical care, or transport costs. These contributions support the rescue work and ensure the puppy is healthy before going to its new home.",
    },
    {
      id: "adoption-5",
      category: "Dog and Puppy Adoption",
      categoryEmoji: "🐶",
      question: "Why should I adopt a rescued dog instead of buying one?",
      answer: "Adopting a rescued dog helps reduce stray animal populations and supports animal welfare. It also gives abandoned animals a second chance to live in a loving home. Rescued dogs are often already vaccinated and healthy. Most importantly, adoption saves a life and reduces demand for unethical breeding.",
    },
    {
      id: "reporting-1",
      category: "Reporting Injured Animals",
      categoryEmoji: "🚨",
      question: "How can I report an injured animal?",
      answer: "If you see an injured stray animal, you can report it through OurPetCare by going to the Report page. Provide details about the animal's location, condition, type of animal, and any injuries you notice. Include a photo if possible. Your report helps volunteers and rescuers locate the animal and provide medical help.",
    },
    {
      id: "reporting-2",
      category: "Reporting Injured Animals",
      categoryEmoji: "🚨",
      question: "What happens after I report an injured animal?",
      answer: "Once a report is submitted, volunteers or rescue organizations review the report and respond to help the animal if resources are available. The assignment system connects available volunteers with the report. Volunteers can update the status as they work to rescue and treat the animal.",
    },
    {
      id: "reporting-3",
      category: "Reporting Injured Animals",
      categoryEmoji: "🚨",
      question: "Can I report injured stray dogs in Tamil Nadu?",
      answer: "Yes. OurPetCare allows people to report injured stray dogs and other animals across Tamil Nadu, helping rescuers identify animals that need urgent care. You can specify the exact location using geolocation, describe the injury, and even upload photos to help rescuers locate and help the animal quickly.",
    },
    {
      id: "health-1",
      category: "Animal Health and Safety",
      categoryEmoji: "🏥",
      question: "What is animal health risk tracking?",
      answer: "Animal health risk tracking helps monitor diseases that can affect animals and humans. OurPetCare provides information about potential risks and helps raise awareness in communities. This includes tracking disease outbreaks, vaccination status, and health concerns that could impact animal welfare across Tamil Nadu.",
    },
    {
      id: "health-2",
      category: "Animal Health and Safety",
      categoryEmoji: "🏥",
      question: "How does OurPetCare help animal welfare?",
      answer: "OurPetCare supports animal welfare by allowing people to report injured animals, adopt rescued pets, and share important animal health information. Our platform connects compassionate people with rescue networks, provides educational resources, and helps coordinate efforts to protect animal health and safety throughout Tamil Nadu.",
    },
  ];

  const categories = [...new Set(faqs.map((f) => f.category))];
  const categoryEmojis = { "Dog and Puppy Adoption": "🐶", "Reporting Injured Animals": "🚨", "Animal Health and Safety": "🏥" };

  const filtered = activeCategory ? faqs.filter((f) => f.category === activeCategory) : faqs;
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = filtered.filter((f) => f.category === cat);
    return acc;
  }, {});

  const toggleExpanded = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>FAQ - Dog Adoption, Animal Rescue | OurPetCare Tamil Nadu</title>
        <meta name="description" content="Frequently asked questions about dog adoption, puppy adoption, animal rescue, and injured animal reporting in Tamil Nadu." />
        <meta name="keywords" content="dog adoption FAQ, puppy adoption, free dog adoption India, animal rescue Tamil Nadu, injured animal reporting, pet adoption questions" />
      </Helmet>

      {/* ─── Hero ─── */}
      <section className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
        <div className="absolute top-4 left-10 text-3xl opacity-20 float-anim">🐾</div>
        <div className="absolute bottom-4 right-10 text-2xl opacity-20 float-anim" style={{ animationDelay: "1s" }}>🐾</div>
        <div className="relative z-10">
          <div className="text-5xl mb-3">❓</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Fredoka', cursive" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Everything you need to know about dog adoption, animal rescue, and reporting injured animals in Tamil Nadu.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all ${
              !activeCategory ? "text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700"
            }`}
            style={!activeCategory ? { background: "var(--primary)" } : {}}>
            All Topics
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-extrabold transition-all ${
                activeCategory === cat ? "text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700"
              }`}
              style={activeCategory === cat ? { background: "var(--primary)" } : {}}>
              {categoryEmojis[cat]} {cat}
            </button>
          ))}
        </div>

        {/* FAQ by Category */}
        {categories.map((category) => {
          const items = grouped[category];
          if (!items || items.length === 0) return null;
          return (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2"
                style={{ fontFamily: "'Fredoka', cursive", color: "var(--text-dark)" }}>
                <span>{categoryEmojis[category]}</span>
                {category}
              </h2>
              <div className="space-y-3">
                {items.map((faq) => (
                  <div key={faq.id} className="card overflow-hidden transition-all">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-teal-50/50 transition-colors">
                      <h3 className="font-extrabold text-gray-800 flex-1 text-base leading-snug">
                        {faq.question}
                      </h3>
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        expandedId === faq.id ? "rotate-180 text-white" : "bg-teal-100 text-teal-600"
                      }`} style={expandedId === faq.id ? { background: "var(--primary)" } : {}}>
                        ▾
                      </span>
                    </button>
                    {expandedId === faq.id && (
                      <div className="px-6 pb-5 border-t border-teal-50">
                        <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="card p-8 text-center" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
          <div className="text-4xl mb-3">💬</div>
          <h2 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "'Fredoka', cursive" }}>
            Still Have Questions?
          </h2>
          <p className="text-teal-100 mb-6 text-sm max-w-md mx-auto">
            Couldn't find the answer? Browse our adoption listings or submit a rescue report to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/adoption"
              className="px-6 py-3 rounded-full font-extrabold text-teal-700 bg-white hover:bg-teal-50 transition-all hover:scale-105 text-sm">
              🐾 Browse Animals
            </Link>
            <Link to="/report"
              className="px-6 py-3 rounded-full font-extrabold text-white border-2 border-white/50 hover:bg-white/15 transition-all hover:scale-105 text-sm">
              🚨 Report an Animal
            </Link>
          </div>
        </section>

        {/* Info box */}
        <section className="p-6 rounded-2xl border-l-4 text-sm" style={{ background: "#f0fdfa", borderColor: "var(--primary)" }}>
          <h3 className="font-extrabold text-teal-800 mb-2">About OurPetCare</h3>
          <p className="text-teal-700">
            OurPetCare is a community platform helping people report injured animals, rescue stray pets, and adopt rescued animals across Tamil Nadu. We connect compassionate volunteers with animals in need and support animal welfare through awareness and coordinated rescue efforts.
          </p>
        </section>
      </div>
    </div>
  );
}
