export default function BenefitsList() {
  const benefits = [
    {
      icon: '🤝',
      title: 'Direct from Owners',
      desc: 'No middlemen—deal directly with property owners for transparent pricing and communication.'
    },
    {
      icon: '📸',
      title: 'Verified Photos',
      desc: 'See real, verified images of every property before you visit or book.'
    },
    {
      icon: '🗺️',
      title: 'Map View',
      desc: 'Explore listings with interactive maps and discover nearby amenities.'
    },
    {
      icon: '🎉',
      title: 'Free 7-Day Trial',
      desc: 'Try all features free for 7 days—no payment required until you’re ready.'
    },
  ];

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">Why Choose FairStay?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-soft hover:shadow-card transition-all">
              <span className="text-4xl mb-4">{b.icon}</span>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{b.title}</h3>
              <p className="text-gray-500 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 