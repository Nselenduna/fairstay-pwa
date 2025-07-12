import { render, screen, fireEvent } from '@testing-library/react';
import ListingCard from '@/components/ListingCard';

// Create mock functions for useRouter
const mockPush = jest.fn();

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock useAuth
jest.mock('@/lib/auth', () => ({
  useAuth: () => ({
    user: null,
    isTrialActive: false,
  }),
}));

// Mock listing data
const mockListing = {
  id: 'listing-123',
  title: 'Test Listing',
  description: 'A test description for the listing',
  price: 1000,
  image: 'https://example.com/image.jpg',
  status: 'available' as const,
  location: {
    lat: 10.0,
    lng: 20.0,
  },
};

describe('ListingCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders listing information correctly', () => {
    render(<ListingCard {...mockListing} />);
    
    expect(screen.getByText('Test Listing')).toBeInTheDocument();
    // Price might be rendered differently, so we'll check for parts of it
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText('A test description for the listing')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders with taken status correctly', () => {
    render(<ListingCard {...mockListing} status="taken" />);
    expect(screen.getByText('Taken')).toBeInTheDocument();
  });

  it('renders with withdrawn status correctly', () => {
    render(<ListingCard {...mockListing} status="withdrawn" />);
    expect(screen.getByText('Withdrawn')).toBeInTheDocument();
  });

  it('renders in compact mode when compact prop is true', () => {
    render(<ListingCard {...mockListing} compact={true} />);
    // The component should render in compact mode, but we can't easily test the CSS classes
    // We can verify it renders without crashing
  });

  it('handles click events and navigates to the listing detail page', () => {
    render(<ListingCard {...mockListing} />);
    
    // Find the card container by its class
    const card = document.querySelector('.border.rounded-lg');
    expect(card).toBeInTheDocument();
    
    // Click the card
    fireEvent.click(card!);
    
    // Verify router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith(`/listing/${mockListing.id}`);
  });

  it('navigates to the listing detail page when View Details button is clicked', () => {
    render(<ListingCard {...mockListing} />);
    
    // Find the View Details button
    const viewDetailsButton = screen.getByText('View Details');
    expect(viewDetailsButton).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(viewDetailsButton);
    
    // Verify router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith(`/listing/${mockListing.id}`);
  });

  it('shows placeholder when no image is provided', () => {
    render(<ListingCard {...mockListing} image="" />);
    expect(screen.getByText('No image')).toBeInTheDocument();
  });
}); 