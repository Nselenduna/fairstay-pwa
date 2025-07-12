"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageCarousel from '@/components/ImageCarousel';
import PaymentModal from '@/components/PaymentModal';
import MapView from '@/components/MapView';
import { useAuth } from '@/lib/auth';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  status: 'available' | 'taken' | 'withdrawn';
  createdAt: any;
  ownerId: string;
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, isTrialActive } = useAuth();
  
  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'listings', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Listing not found</p>
          <p className="text-sm">The listing you're looking for may have been removed or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleContactOwner = () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }
    
    if (!isTrialActive && !user.isPaid) {
      setShowPaymentModal(true);
      return;
    }
    
    // Show contact information
    alert('Contact information will be displayed here');
  };

  // Determine if content should be blurred
  const shouldBlur = !isTrialActive && !user?.isPaid;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
      
      {/* Image Carousel */}
      <div className={`mb-6 ${shouldBlur ? 'blur-lg relative' : ''}`}>
        <ImageCarousel images={listing.images} />
        
        {shouldBlur && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black bg-opacity-70 text-white p-4 rounded-md text-center">
              <p className="font-bold text-lg">Upgrade to view full images</p>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
          listing.status === 'available' ? 'bg-green-100 text-green-800' : 
          listing.status === 'taken' ? 'bg-red-100 text-red-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
        </span>
      </div>
      
      {/* Price */}
      <div className="text-2xl font-bold mb-4">
        ${listing.price} / month
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{listing.description}</p>
      </div>
      
      {/* Amenities */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <ul className="grid grid-cols-2 gap-2">
          {listing.amenities?.map((amenity, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              {amenity}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Map */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <MapView location={listing.location} isBlurred={shouldBlur} />
      </div>
      
      {/* Contact Button */}
      <div className="mt-6">
        <button 
          onClick={handleContactOwner}
          disabled={listing.status !== 'available'}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {listing.status === 'available' ? 'Contact Owner' : 'Not Available'}
        </button>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
} 