import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-indigo-50 to-white">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 max-w-xl">
        Find rental properties directly from the owner
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
        No agent fees. Verified listings. Secure payments. Start your search or list your property today.
      </p>
      <Link href="/upload" className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-lg">
        List Your Property
      </Link>
    </section>
  );
} 