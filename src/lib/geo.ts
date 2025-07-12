// Interface for location coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Get the user's current location using the browser's Geolocation API
 * @returns Promise that resolves to coordinates {lat, lng}
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param coords1 First coordinate {lat, lng}
 * @param coords2 Second coordinate {lat, lng}
 * @returns Distance in kilometers
 */
export function calculateDistance(coords1: Coordinates, coords2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get a static map URL for a given location
 * @param coords Coordinates {lat, lng}
 * @param zoom Zoom level (1-20)
 * @param width Map width in pixels
 * @param height Map height in pixels
 * @returns URL for a static map image
 */
export function getStaticMapUrl(
  coords: Coordinates,
  zoom: number = 15,
  width: number = 600,
  height: number = 400
): string {
  // This function would use a map provider API
  // For example, with Google Maps:
  return `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=${zoom}&size=${width}x${height}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  
  // For demonstration purposes, you could return a placeholder:
  // return `https://via.placeholder.com/${width}x${height}?text=Map+at+${coords.lat},${coords.lng}`;
}

/**
 * Get nearby amenities for a location
 * @param coords Coordinates {lat, lng}
 * @param radius Search radius in meters
 * @param types Types of places to search for
 * @returns Promise that resolves to an array of nearby places
 */
export async function getNearbyAmenities(
  coords: Coordinates,
  radius: number = 1000,
  types: string[] = ['restaurant', 'school', 'hospital', 'bus_station']
): Promise<any[]> {
  // This would typically call a Places API
  // For now, return mock data
  return [
    { 
      name: 'Local Restaurant',
      type: 'restaurant',
      distance: 0.3,
      coords: { lat: coords.lat + 0.001, lng: coords.lng + 0.001 }
    },
    { 
      name: 'City Hospital',
      type: 'hospital',
      distance: 0.8,
      coords: { lat: coords.lat - 0.002, lng: coords.lng + 0.002 }
    },
    { 
      name: 'Central School',
      type: 'school',
      distance: 0.5,
      coords: { lat: coords.lat + 0.002, lng: coords.lng - 0.001 }
    },
    { 
      name: 'Bus Terminal',
      type: 'bus_station',
      distance: 0.4,
      coords: { lat: coords.lat - 0.001, lng: coords.lng - 0.002 }
    }
  ];
} 