// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock the next/router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock the firebase modules
jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  storage: {},
}));

// Mock the auth context
jest.mock('@/lib/auth', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
    isTrialActive: false,
    isAdmin: false,
    trialDaysLeft: 0,
    signOut: jest.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock the Intersection Observer
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    this.callback([{ isIntersecting: true }]);
  }

  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window.google for Maps
global.google = {
  maps: {
    Map: class {},
    Marker: class {
      setMap() {}
      addListener() {}
    },
    InfoWindow: class {
      open() {}
    },
    LatLng: class {},
  },
}; 