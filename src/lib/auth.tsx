import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth as firebaseAuth, db } from './firebase';
import { createHash } from 'crypto';

// Extended user type with custom fields
export interface User extends FirebaseUser {
  isPaid?: boolean;
  isAdmin?: boolean;
  phone?: string;
  phoneHash?: string;
  trialStartDate?: any;
  paymentDate?: any;
  trialStatus?: 'active' | 'expired' | 'none';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isTrialActive: boolean;
  isAdmin: boolean;
  trialDaysLeft: number;
  signOut: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isTrialActive: false,
  isAdmin: false,
  trialDaysLeft: 0,
  signOut: async () => {}
});

// Hash phone number for privacy and consistency
export const hashPhoneNumber = (phone: string): string => {
  try {
    return createHash('sha256').update(phone).digest('hex');
  } catch (error) {
    // If running in browser environment where crypto isn't available
    // Use a simple hash function (not secure for production)
    let hash = 0;
    for (let i = 0; i < phone.length; i++) {
      const char = phone.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }
};

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Check if trial is active and calculate days left
            let trialStatus = 'none';
            let daysLeft = 0;
            
            if (userData.trialStartDate) {
              const trialStart = new Date(userData.trialStartDate.seconds * 1000);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - trialStart.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays <= 7) {
                trialStatus = 'active';
                daysLeft = 7 - diffDays;
              } else {
                trialStatus = 'expired';
              }
              
              setTrialDaysLeft(daysLeft);
              setIsTrialActive(diffDays <= 7);
            }
            
            // Extend Firebase user with custom data
            const extendedUser: User = {
              ...firebaseUser,
              isPaid: userData.isPaid || false,
              isAdmin: userData.isAdmin || false,
              phone: userData.phone || '',
              phoneHash: userData.phoneHash || '',
              trialStartDate: userData.trialStartDate,
              paymentDate: userData.paymentDate,
              trialStatus: trialStatus as 'active' | 'expired' | 'none'
            };
            
            setUser(extendedUser);
            setIsAdmin(userData.isAdmin || false);
          } else {
            // If no Firestore data, just use Firebase user
            setUser(firebaseUser as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(firebaseUser as User);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsTrialActive(false);
        setTrialDaysLeft(0);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isTrialActive, 
      isAdmin, 
      trialDaysLeft,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth
export function useAuth() {
  return useContext(AuthContext);
}

// Check if phone number has been used before
export async function checkPhoneNumberUsed(phone: string): Promise<boolean> {
  try {
    const phoneHash = hashPhoneNumber(phone);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phoneHash', '==', phoneHash));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking phone number:', error);
    return false;
  }
}

// Export the auth instance
export const auth = firebaseAuth; 