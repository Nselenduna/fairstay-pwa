"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import PaymentModal from './PaymentModal';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePaid?: boolean;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requirePaid = false,
  adminOnly = false
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isTrialActive, isAdmin } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  useEffect(() => {
    // Skip protection checks while auth is loading
    if (isLoading) return;
    
    // If auth is required and user is not logged in
    if (requireAuth && !user) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push('/auth/login');
      return;
    }
    
    // If admin access is required but user is not admin
    if (adminOnly && !isAdmin) {
      router.push('/');
      return;
    }
    
    // If paid access is required but user doesn't have active trial or paid account
    if (requirePaid && user && !isTrialActive && !user.isPaid) {
      setShowPaymentModal(true);
    }
  }, [user, isLoading, isTrialActive, isAdmin, requireAuth, requirePaid, adminOnly, router, pathname]);
  
  // While loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If auth is required and user is not logged in, don't render children
  if (requireAuth && !user) {
    return null;
  }
  
  // If admin access is required but user is not admin, don't render children
  if (adminOnly && !isAdmin) {
    return null;
  }
  
  return (
    <>
      {children}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
} 