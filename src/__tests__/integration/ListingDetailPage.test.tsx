import { render, screen, waitFor } from '@testing-library/react';
import ListingDetailPage from '@/app/listing/[id]/page';
import { useAuth } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';

// Mock the useAuth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock the useParams hook
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-listing-123' }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock components
jest.mock('@/components/ImageCarousel', () => ({
  __esModule: true,
  default: ({ images }: { images: string[] }) => (
    <div data-testid="image-carousel">
      {images.map((img, i) => (
        <div key={i} data-src={img}>Image {i + 1}</div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/MapView', () => ({
  __esModule: true,
  default: ({ location, isBlurred }: { location: any, isBlurred?: boolean }) => (
    <div data-testid="map-view" data-blurred={isBlurred}>
      Map at {location.lat}, {location.lng}
    </div>
  ),
}));

jest.mock('@/components/PaymentModal', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="payment-modal">
      Payment Modal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('ListingDetailPage', () => {
  // Mock listing data
  const mockListing = {
    id: 'test-listing-123',
    title: 'Test Listing',
    description: 'A detailed description of the test listing',
    price: 1200,
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    location: {
      lat: 10.0,
      lng: 20.0,
    },
    amenities: ['WiFi', 'Parking', 'Air Conditioning'],
    status: 'available',
    createdAt: { toDate: () => new Date() },
    ownerId: 'owner-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default auth state (not logged in)
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      isTrialActive: false,
      isAdmin: false,
    });
    
    // Mock Firestore getDoc to return the listing
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockListing,
      id: 'test-listing-123',
    });
  });

  it('loads and displays listing details', async () => {
    render(<ListingDetailPage />);
    
    // Check for loading spinner instead of text
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Test Listing')).toBeInTheDocument();
    });
    
    // Check that listing details are displayed
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
    
    // Check for price (which might be rendered as separate elements)
    expect(screen.getByText(/1200/)).toBeInTheDocument();
    expect(screen.getByText(/month/)).toBeInTheDocument();
    
    expect(screen.getByText('A detailed description of the test listing')).toBeInTheDocument();
    
    // Check that amenities are displayed
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
    
    // Check that status badge is displayed
    expect(screen.getByText('Available')).toBeInTheDocument();
    
    // Check that ImageCarousel is rendered
    expect(screen.getByTestId('image-carousel')).toBeInTheDocument();
    
    // Check that MapView is rendered
    expect(screen.getByTestId('map-view')).toBeInTheDocument();
  });

  it('blurs content for unpaid users', async () => {
    // Mock authenticated but not paid user
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'user-123', email: 'test@example.com', isPaid: false },
      isLoading: false,
      isTrialActive: false,
      isAdmin: false,
    });
    
    render(<ListingDetailPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Test Listing')).toBeInTheDocument();
    });
    
    // Check that map view has blur attribute set
    const mapView = screen.getByTestId('map-view');
    expect(mapView.getAttribute('data-blurred')).toBe('true');
    
    // Check for upgrade message
    expect(screen.getByText('Upgrade to view full images')).toBeInTheDocument();
  });

  it('does not blur content for users with active trial', async () => {
    // Mock authenticated user with active trial
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'user-123', email: 'test@example.com', isPaid: false },
      isLoading: false,
      isTrialActive: true,
      isAdmin: false,
    });
    
    render(<ListingDetailPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Test Listing')).toBeInTheDocument();
    });
    
    // Check that map view does not have blur attribute set
    const mapView = screen.getByTestId('map-view');
    expect(mapView.getAttribute('data-blurred')).toBe('false');
    
    // Check that upgrade message is not displayed
    expect(screen.queryByText('Upgrade to view full images')).not.toBeInTheDocument();
  });

  it('does not blur content for paid users', async () => {
    // Mock authenticated and paid user
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'user-123', email: 'test@example.com', isPaid: true },
      isLoading: false,
      isTrialActive: false,
      isAdmin: false,
    });
    
    render(<ListingDetailPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Test Listing')).toBeInTheDocument();
    });
    
    // Check that map view does not have blur attribute set
    const mapView = screen.getByTestId('map-view');
    expect(mapView.getAttribute('data-blurred')).toBe('false');
    
    // Check that upgrade message is not displayed
    expect(screen.queryByText('Upgrade to view full images')).not.toBeInTheDocument();
  });

  it('handles non-existent listings', async () => {
    // Mock Firestore getDoc to return non-existent listing
    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    });
    
    render(<ListingDetailPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Listing not found')).toBeInTheDocument();
    });
    
    // Check that error message is displayed
    expect(screen.getByText('Listing not found')).toBeInTheDocument();
  });
}); 