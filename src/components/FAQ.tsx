export default function FAQ() {
  const faqs = [
    {
      q: 'How do I list my property?',
      a: 'Simply sign up for a free account, go to the "List Property" page, and fill out the form with your property details and photos.'
    },
    {
      q: 'Is there a fee to use FairStay?',
      a: 'Browsing and listing properties is free. After your 7-day trial, a small fee is required to unlock full access to all features.'
    },
    {
      q: 'How are listings verified?',
      a: 'We review all listings and require real photos and location data to ensure authenticity and quality.'
    },
    {
      q: 'What happens after my trial ends?',
      a: 'You can still browse listings, but images and contact details will be blurred until you upgrade to a paid plan.'
    },
    {
      q: 'How do I contact a property owner?',
      a: 'Once you find a property you like, use the contact form on the listing page to message the owner directly.'
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-50 rounded-xl shadow-soft p-6">
              <h3 className="font-semibold text-lg text-indigo-700 mb-2">{faq.q}</h3>
              <p className="text-gray-700 text-base">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 