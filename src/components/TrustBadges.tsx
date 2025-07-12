export default function TrustBadges() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center gap-6 py-8 bg-white">
      <div className="flex flex-col items-center">
        <span className="text-3xl mb-2">💸</span>
        <span className="text-sm font-medium text-gray-700">No Agent Fees</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl mb-2">✅</span>
        <span className="text-sm font-medium text-gray-700">Verified Listings</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl mb-2">🔒</span>
        <span className="text-sm font-medium text-gray-700">Secure Payments</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-3xl mb-2">🎁</span>
        <span className="text-sm font-medium text-gray-700">7-Day Free Trial</span>
      </div>
    </section>
  );
} 