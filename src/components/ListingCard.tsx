"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useInView } from 'react-intersection-observer';

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status: 'available' | 'taken' | 'withdrawn';
  location?: {
    lat: number;
    lng: number;
  };
  compact?: boolean;
}

export default function ListingCard({
  id,
  title,
  description,
  price,
  image,
  status,
  location,
  compact = false
}: ListingCardProps) {
  const router = useRouter();
  const { user, isTrialActive } = useAuth();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Use Intersection Observer for lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });
  
  const handleCardClick = () => {
    router.push(`/listing/${id}`);
  };
  
  // Determine if image should be blurred
  const shouldBlur = !isTrialActive && !user?.isPaid;
  
  // Truncate description for compact view
  const truncatedDescription = compact && description.length > 100
    ? `${description.substring(0, 100)}...`
    : description;
  
  return (
    <div 
      ref={ref}
      className="card overflow-hidden group animate-fadeIn"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      {/* Image */}
      <div className={`relative ${compact ? 'h-40' : 'h-56'} overflow-hidden img-hover-zoom`}>
        {image ? (
          <>
            {inView && (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                } ${shouldBlur ? 'blur-md' : ''}`}
                onLoadingComplete={() => setIsImageLoaded(true)}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
              />
            )}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${
            status === 'available' ? 'badge-success' : 
            status === 'taken' ? 'badge-danger' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        {shouldBlur && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white">
            <div className="text-center p-4 glass rounded-lg">
              <p className="font-semibold">Upgrade to view</p>
              <p className="text-sm">Full access requires payment</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">{title}</h3>
        <p className="text-indigo-600 font-bold mb-2">${price.toLocaleString()}/month</p>
        
        {!compact && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncatedDescription}
          </p>
        )}
        
        {/* View button for non-compact view */}
        {!compact && (
          <div className="mt-3 flex justify-between items-center">
            <button 
              className="btn btn-secondary text-sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/listing/${id}`);
              }}
            >
              View Details
            </button>
            
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Map available</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 