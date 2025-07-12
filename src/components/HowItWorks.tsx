export default function HowItWorks() {
  const steps = [
    {
      icon: '📝',
      title: 'Sign Up',
      desc: 'Create your free account as a renter or property owner.'
    },
    {
      icon: '🔍',
      title: 'Browse Listings',
      desc: 'Explore verified properties with photos, maps, and details.'
    },
    {
      icon: '💬',
      title: 'Contact & Book',
      desc: 'Message owners directly and book your stay securely.'
    },
    {
      icon: '🏠',
      title: 'List Your Property',
      desc: 'Owners can add properties in minutes, for free.'
    },
  ];

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow-soft hover:shadow-card transition-all">
              <span className="text-4xl mb-4">{step.icon}</span>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 