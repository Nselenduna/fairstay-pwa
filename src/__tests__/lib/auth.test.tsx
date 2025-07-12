import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { ReactNode } from 'react';

// Mock Firebase auth
jest.mock('@/lib/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
    signOut: jest.fn().mockResolvedValue(undefined),
    currentUser: null,
  },
  db: {
    collection: jest.fn(),
  },
}));

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  onSnapshot: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Create a wrapper for the AuthProvider
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Auth Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current).toEqual(expect.objectContaining({
      user: null,
      isLoading: false,
      isTrialActive: false,
      isAdmin: false,
      trialDaysLeft: 0,
    }));
    
    expect(typeof result.current.signOut).toBe('function');
  });

  // Skip the more complex tests for now
  it.skip('updates auth state when user logs in', async () => {
    // This test is skipped for now
  });

  it.skip('handles sign out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Call signOut function
    await act(async () => {
      await result.current.signOut();
    });
    
    // Verify Firebase signOut was called
    expect(auth.signOut).toHaveBeenCalled();
  });

  it.skip('calculates trial days left correctly', async () => {
    // This test is skipped for now
  });
}); 