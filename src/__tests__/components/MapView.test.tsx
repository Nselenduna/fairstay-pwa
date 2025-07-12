import { render, screen, waitFor, act } from '@testing-library/react';
import MapView from '@/components/MapView';
import { getNearbyAmenities } from '@/lib/geo';

// Mock the getNearbyAmenities function
jest.mock('@/lib/geo', () => ({
  getNearbyAmenities: jest.fn(),
}));

// Mock location data
const mockLocation = {
  lat: 10.0,
  lng: 20.0,
};

// Mock amenities data
const mockAmenities = [
  {
    name: 'Test Restaurant',
    type: 'restaurant',
    coords: { lat: 10.01, lng: 20.01 },
    distance: 0.5,
  },
  {
    name: 'Test Hospital',
    type: 'hospital',
    coords: { lat: 10.02, lng: 20.02 },
    distance: 1.2,
  },
];

describe('MapView', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    (getNearbyAmenities as jest.Mock).mockReset();
    (getNearbyAmenities as jest.Mock).mockResolvedValue(mockAmenities);
  });

  it('renders the map container', async () => {
    render(<MapView location={mockLocation} />);
    
    // Wait for any async operations to complete
    await waitFor(() => {
      // The map container should be in the document with the right class
      const mapContainer = screen.getByTestId('map-view');
      expect(mapContainer).toBeInTheDocument();
    });
  });

  it('renders with blur when isBlurred prop is true', async () => {
    render(<MapView location={mockLocation} isBlurred={true} />);
    
    // Wait for any async operations to complete
    await waitFor(() => {
      // Check for blur class
      const mapContainer = screen.getByTestId('map-view');
      expect(mapContainer).toHaveAttribute('data-blurred', 'true');
      
      // Check for upgrade message
      expect(screen.getByText('Upgrade to view map and nearby amenities')).toBeInTheDocument();
    });
  });

  it('fetches nearby amenities on mount', async () => {
    render(<MapView location={mockLocation} />);
    
    // Wait for any async operations to complete
    await waitFor(() => {
      // Verify getNearbyAmenities was called with the correct location
      expect(getNearbyAmenities).toHaveBeenCalledWith(mockLocation);
    });
  });

  it('does not render amenities list when isBlurred is true', async () => {
    render(<MapView location={mockLocation} isBlurred={true} />);
    
    // Wait for any async operations to complete
    await waitFor(() => {
      // The "Nearby Amenities" heading should not be in the document
      expect(screen.queryByText('Nearby Amenities')).not.toBeInTheDocument();
    });
  });
}); 