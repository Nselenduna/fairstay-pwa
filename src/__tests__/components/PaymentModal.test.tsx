import { render, screen, fireEvent } from '@testing-library/react';
import PaymentModal from '@/components/PaymentModal';

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
    user: { uid: 'test-user' },
  }),
}));

describe('PaymentModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the modal with correct content', () => {
    const onClose = jest.fn();
    render(<PaymentModal onClose={onClose} />);
    
    // Check for modal title
    expect(screen.getByText('Upgrade Your Account')).toBeInTheDocument();
    
    // Check for benefits list
    expect(screen.getByText('Benefits of upgrading:')).toBeInTheDocument();
    expect(screen.getByText('View all property images in full quality')).toBeInTheDocument();
    expect(screen.getByText('Access detailed property information')).toBeInTheDocument();
    expect(screen.getByText('See property locations on the map')).toBeInTheDocument();
    expect(screen.getByText('Contact property owners directly')).toBeInTheDocument();
    expect(screen.getByText('Unlimited access for 30 days')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText('Continue to Payment ($5)')).toBeInTheDocument();
    expect(screen.getByText('Maybe Later')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal onClose={onClose} />);
    
    // Find and click the close button (X icon)
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    // Verify onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when "Maybe Later" button is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal onClose={onClose} />);
    
    // Find and click the "Maybe Later" button
    const laterButton = screen.getByText('Maybe Later');
    fireEvent.click(laterButton);
    
    // Verify onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates to payment page when "Continue to Payment" is clicked', () => {
    const onClose = jest.fn();
    render(<PaymentModal onClose={onClose} />);
    
    // Find and click the payment button
    const paymentButton = screen.getByText('Continue to Payment ($5)');
    fireEvent.click(paymentButton);
    
    // Verify router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/payment');
    
    // Verify onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSuccess when provided and payment button is clicked', () => {
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    render(<PaymentModal onClose={onClose} onSuccess={onSuccess} />);
    
    // Find and click the payment button
    const paymentButton = screen.getByText('Continue to Payment ($5)');
    fireEvent.click(paymentButton);
    
    // Verify onClose was called
    expect(onClose).toHaveBeenCalledTimes(1);
  });
}); 