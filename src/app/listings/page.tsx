"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ListingCard from '@/components/ListingCard';

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

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchListings(true);
    // eslint-disable-next-line
  }, []);

  const fetchListings = async (resetPagination: boolean = false) => {
    if (resetPagination) {
      setLoading(true);
      setListings([]);
    } else {
      setLoadingMore(true);
    }

    try {
      let q = query(
        collection(db, 'listings'),
        orderBy('createdAt', 'desc')
      );
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

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchListings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 text-center">All Listings</h1>
        <p className="text-gray-600 mb-10 text-center">Browse all available properties on FairStay.</p>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-xl font-medium text-gray-600">No listings found</h3>
            <p className="text-gray-500 mt-2">Try again later or check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing, index) => (
                <div key={listing.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ListingCard {...listing} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="btn btn-primary px-8 py-3 text-lg"
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 