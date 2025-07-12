"use client";

import { useState, useEffect, useRef } from 'react';
import { getNearbyAmenities, Coordinates } from '@/lib/geo';

interface MapViewProps {
  location: Coordinates;
  isBlurred?: boolean;
}

export default function MapView({ location, isBlurred = false }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize map when component mounts
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      // Load Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
      
      return () => {
        // Clean up script if component unmounts before script loads
        document.head.removeChild(script);
      };
    } else {
      // Google Maps API already loaded
      initializeMap();
    }
  }, []);
  
  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    try {
      const mapOptions = {
        center: { lat: location.lat, lng: location.lng },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };
      
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      
      // Add marker for the listing location
      new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: newMap,
        title: 'Property Location',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });
      
      // Fetch and display nearby amenities
      fetchAmenities();
    } catch (error) {
      console.error('Error initializing map:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch nearby amenities
  const fetchAmenities = async () => {
    try {
      const nearbyAmenities = await getNearbyAmenities(location);
      setAmenities(nearbyAmenities);
      
      // Add markers for amenities if map is initialized
      if (map) {
        nearbyAmenities.forEach(amenity => {
          const marker = new google.maps.Marker({
            position: { lat: amenity.coords.lat, lng: amenity.coords.lng },
            map,
            title: amenity.name,
            icon: {
              url: getMarkerIconByType(amenity.type),
            },
          });
          
          // Add info window for each amenity
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3 style="font-weight: bold;">${amenity.name}</h3>
                <p>${amenity.type.replace('_', ' ')}</p>
                <p>${amenity.distance.toFixed(1)} km away</p>
              </div>
            `,
          });
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };
  
  // Get marker icon based on amenity type
  const getMarkerIconByType = (type: string): string => {
    switch (type) {
      case 'restaurant':
        return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      case 'school':
        return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'hospital':
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'bus_station':
        return 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
      default:
        return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  return (
    <div className="w-full">
      {/* Map container */}
      <div 
        ref={mapRef} 
        data-testid="map-view"
        data-blurred={isBlurred}
        className={`w-full h-64 rounded-lg ${isBlurred ? 'blur-md' : ''}`}
        style={{ 
          background: '#f0f0f0',
        }}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Nearby amenities list */}
      {!isBlurred && amenities.length > 0 && (
        <div className="mt-4" data-testid="amenities-list">
          <h3 className="text-lg font-medium mb-2">Nearby Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                <div className="w-2 h-2 rounded-full mr-2" style={{ 
                  backgroundColor: 
                    amenity.type === 'restaurant' ? '#FFD700' :
                    amenity.type === 'school' ? '#008000' :
                    amenity.type === 'hospital' ? '#FF0000' :
                    amenity.type === 'bus_station' ? '#800080' : '#808080'
                }} />
                <div>
                  <p className="font-medium">{amenity.name}</p>
                  <p className="text-sm text-gray-600">{amenity.distance.toFixed(1)} km away</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Blurred overlay with upgrade message */}
      {isBlurred && (
        <div className="mt-2 text-center p-2 bg-blue-50 rounded-md">
          <p className="text-blue-800 font-medium">Upgrade to view map and nearby amenities</p>
        </div>
      )}
    </div>
  );
} 