import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth';

// Create mock functions for useRouter
const mockPush = jest.fn();
const mockPathname = '/test-path';

// Mock the useAuth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReset();
    
    // Default mock implementation
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      isTrialActive: false,
      isAdmin: false,
    });
    
    // Clear session storage
    sessionStorage.clear();
  });

  it('shows loading spinner when auth is loading', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
      isTrialActive: false,
      isAdmin: false,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Loading spinner should be visible
    const loadingSpinner = document.querySelector('div[class*="animate-spin"]');
    expect(loadingSpinner).toBeInTheDocument();
    
    // Content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Should redirect to login
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
    
    // Content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    
    // Should store the current path in sessionStorage
    expect(sessionStorage.getItem('redirectAfterLogin')).toBe('/test-path');
  });

  it('renders children when user is authenticated', () => {
    // Mock authenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com' },
      isLoading: false,
      isTrialActive: true,
      isAdmin: false,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Content should be visible
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows payment modal when requirePaid is true and user is not paid', () => {
    // Mock authenticated but not paid user
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com', isPaid: false },
      isLoading: false,
      isTrialActive: false,
      isAdmin: false,
    });
    
    render(
      <ProtectedRoute requirePaid={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Content should be visible
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Payment modal should be visible
    expect(screen.getByText('Upgrade Your Account')).toBeInTheDocument();
  });

  it('does not show payment modal when user has active trial', () => {
    // Mock authenticated user with active trial
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com', isPaid: false },
      isLoading: false,
      isTrialActive: true,
      isAdmin: false,
    });
    
    render(
      <ProtectedRoute requirePaid={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Content should be visible
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Payment modal should not be visible
    expect(screen.queryByText('Upgrade Your Account')).not.toBeInTheDocument();
  });

  it('redirects non-admin users from admin routes', () => {
    // Mock authenticated but non-admin user
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123', email: 'test@example.com' },
      isLoading: false,
      isTrialActive: true,
      isAdmin: false,
    });
    
    render(
      <ProtectedRoute adminOnly={true}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Should redirect to home
    expect(mockPush).toHaveBeenCalledWith('/');
    
    // Content should not be visible
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('allows admin users to access admin routes', () => {
    // Mock admin user
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: '123', email: 'admin@example.com' },
      isLoading: false,
      isTrialActive: true,
      isAdmin: true,
    });
    
    render(
      <ProtectedRoute adminOnly={true}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Content should be visible
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
}); 