// Firebase and Database Types
export interface Listing {
  id?: string;
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

export interface UserData {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  isPaid: boolean;
  isAdmin?: boolean;
  trialStartDate: any;
  paymentDate?: any;
  lastPaymentId?: string;
}

// Google Maps API types
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        InfoWindow: typeof google.maps.InfoWindow;
        LatLng: typeof google.maps.LatLng;
        MapOptions: google.maps.MapOptions;
      };
    };
  }
}

export {}; 