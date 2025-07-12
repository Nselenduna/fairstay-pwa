"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const handleGoToPayment = () => {
    router.push('/payment');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Upgrade Your Account</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              To unlock full access to FairStay, please upgrade to a paid account.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-blue-800 mb-2">Benefits of upgrading:</h3>
              <ul className="list-disc pl-5 text-blue-800 space-y-1">
                <li>View all property images in full quality</li>
                <li>Access detailed property information</li>
                <li>See property locations on the map</li>
                <li>Contact property owners directly</li>
                <li>Unlimited access for 30 days</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleGoToPayment}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue to Payment ($5)
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 