import Link from 'next/link';

export default function HomeCTA() {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your perfect stay?</h2>
        <p className="text-lg mb-8 text-indigo-100">Join thousands of satisfied users who have found their ideal accommodations through FairStay.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/auth" className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-lg">
            Sign Up Now
          </Link>
          <Link href="/upload" className="bg-pink-500 text-white hover:bg-pink-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-lg">
            List Your Property
          </Link>
        </div>
      </div>
    </section>
  );
} 