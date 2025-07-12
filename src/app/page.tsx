"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import ListingCard from '@/components/ListingCard';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import BenefitsList from '@/components/BenefitsList';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import HomeCTA from '@/components/HomeCTA';
import FAQ from '@/components/FAQ';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: 'available' | 'taken' | 'withdrawn';
  location: {
    lat: number;
    lng: number;
  };
}

export default function HomePage() {
  const router = useRouter();
  const { user, isTrialActive } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'taken'>('all');
  
  // Pagination state
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchListings(true);
  }, [filterStatus]);

  const fetchListings = async (resetPagination: boolean = false) => {
    if (resetPagination) {
      setLoading(true);
      setListings([]);
    } else {
      setLoadingMore(true);
    }

    try {
      // Create a base query
      let q = query(
        collection(db, 'listings'),
        orderBy('createdAt', 'desc')
      );
      
      // Add status filter if not 'all'
      if (filterStatus !== 'all') {
        q = query(q, where('status', '==', filterStatus));
      }
      
      // Apply pagination
      if (!resetPagination && lastVisible) {
        q = query(q, startAfter(lastVisible), limit(ITEMS_PER_PAGE));
      } else {
        q = query(q, limit(ITEMS_PER_PAGE));
      }
      
      const querySnapshot = await getDocs(q);
      const listingsData: Listing[] = [];
      
      querySnapshot.forEach((doc) => {
        listingsData.push({
          id: doc.id,
          ...doc.data()
        } as Listing);
      });
      
      // Update pagination state
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc || null);
      setHasMore(querySnapshot.docs.length >= ITEMS_PER_PAGE);
      
      if (resetPagination) {
        setListings(listingsData);
      } else {
        setListings(prev => [...prev, ...listingsData]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more listings
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchListings(false);
    }
  };

  // Filter listings based on search term
  const filteredListings = listings.filter(listing => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower)
    );
  });

  // Handle filter change
  const handleFilterChange = (status: 'all' | 'available' | 'taken') => {
    setFilterStatus(status);
    // Reset pagination when filter changes
    setLastVisible(null);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is client-side filtering, no need to refetch
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      <TrustBadges />
      <BenefitsList />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <HomeCTA />
      
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-display font-semibold">Available Properties</h2>
            <p className="text-gray-600 mt-1">Find your next home from our curated listings</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  filterStatus === 'all' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('available')}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  filterStatus === 'available' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
            </div>
            
            {user && (
              <button
                onClick={() => router.push('/upload')}
                className="btn btn-success"
              >
                + Add Listing
              </button>
            )}
          </div>
        </div>
        
        {/* Listings */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-xl font-medium text-gray-600">No listings found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing, index) => (
                <div key={listing.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    description={listing.description}
                    price={listing.price}
                    image={listing.images[0] || ''}
                    status={listing.status}
                    location={listing.location}
                  />
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex justify-center mt-10">
          <a href="/listings" className="btn btn-primary px-8 py-3 text-lg shadow-md hover:bg-indigo-700 transition-colors">View All Listings</a>
        </div>
      </div>
      
      {/* Featured Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Why Choose FairStay?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform connects property owners directly with tenants, eliminating middlemen and unnecessary fees.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">All payments are processed securely, and your personal information is protected.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">All properties are verified to ensure you're getting exactly what you see.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">We're transparent about costs. What you see is what you pay, with no surprise charges.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to find your perfect stay?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">Join thousands of satisfied users who have found their ideal accommodations through FairStay.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => router.push('/auth/register')} className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Sign Up Now
            </button>
            <button onClick={() => router.push('/upload')} className="bg-pink-500 text-white hover:bg-pink-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 