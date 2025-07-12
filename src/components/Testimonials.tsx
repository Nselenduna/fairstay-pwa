export default function Testimonials() {
  const testimonials = [
    {
      name: 'Alice M.',
      avatar: '👩🏽',
      quote: 'FairStay made it so easy to find a safe, affordable place. No agents, no hassle!',
      rating: 5
    },
    {
      name: 'Brian K.',
      avatar: '👨🏻',
      quote: 'I listed my property in minutes and found great tenants. The process was transparent and smooth.',
      rating: 5
    },
    {
      name: 'Chipo N.',
      avatar: '👩🏿',
      quote: 'I love that I can see real photos and contact owners directly. Highly recommend FairStay!',
      rating: 4
    },
  ];

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow-soft p-6 flex flex-col items-center text-center hover:shadow-card transition-all">
              <span className="text-5xl mb-4">{t.avatar}</span>
              <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
              <div className="flex items-center mb-2">
                {[...Array(t.rating)].map((_, idx) => (
                  <span key={idx} className="text-yellow-400 text-lg">★</span>
                ))}
                {[...Array(5 - t.rating)].map((_, idx) => (
                  <span key={idx} className="text-gray-300 text-lg">★</span>
                ))}
              </div>
              <span className="font-semibold text-gray-800">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 