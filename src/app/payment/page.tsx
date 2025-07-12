"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { verifyPayment } from '@/lib/payments';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [transactionId, setTransactionId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentStep, setPaymentStep] = useState<'instructions' | 'verify'>('instructions');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!transactionId || !phoneNumber) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to make a payment');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real app, this would call an API to verify the payment
      const isVerified = await verifyPayment({
        transactionId,
        phoneNumber,
        userId: user.uid
      });
      
      if (isVerified) {
        // Update user's payment status in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          isPaid: true,
          paymentDate: serverTimestamp(),
          lastPaymentId: transactionId
        });
        
        setSuccessMessage('Payment verified successfully! Your account has been upgraded.');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError('Payment verification failed. Please check your transaction ID and try again.');
      }
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setError(err.message || 'An error occurred during payment verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upgrade Your Account</h1>
        
        <div className="max-w-2xl mx-auto">
          {successMessage ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="mb-4 text-green-600">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h2>
              <p className="text-green-700 mb-4">{successMessage}</p>
              <p className="text-sm text-green-600">Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Progress Steps */}
              <div className="flex border-b">
                <button
                  onClick={() => setPaymentStep('instructions')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    paymentStep === 'instructions' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500'
                  }`}
                >
                  1. Payment Instructions
                </button>
                <button
                  onClick={() => setPaymentStep('verify')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    paymentStep === 'verify' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500'
                  }`}
                  disabled={paymentStep === 'instructions'}
                >
                  2. Verify Payment
                </button>
              </div>
              
              {/* Payment Instructions Step */}
              {paymentStep === 'instructions' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Instructions</h2>
                  
                  <div className="bg-blue-50 p-6 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-4 text-lg">Follow these steps to upgrade your account:</h3>
                    <ol className="list-decimal pl-5 text-blue-800 space-y-4">
                      <li>
                        <p>Send <strong>$5 USD</strong> to the following Eco-cash number:</p>
                        <div className="bg-white p-3 rounded mt-2 text-center">
                          <p className="font-bold text-lg">+263 71 234 5678</p>
                          <p className="text-sm text-gray-500">Account Name: FairStay Rentals</p>
                        </div>
                      </li>
                      <li>
                        <p>After sending payment, you will receive a confirmation message with a transaction ID.</p>
                        <p className="text-sm text-gray-600 mt-1">Example: "Your payment of $5 to FairStay Rentals was successful. Transaction ID: ECO123456789"</p>
                      </li>
                      <li>
                        <p>Keep this transaction ID handy for the next step.</p>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setPaymentStep('verify')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      I've Made the Payment
                    </button>
                  </div>
                </div>
              )}
              
              {/* Verify Payment Step */}
              {paymentStep === 'verify' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Verify Your Payment</h2>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. +263 71 234 5678"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">Enter the phone number you used to make the payment</p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        id="transactionId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. ECO123456789"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">Enter the transaction ID from your payment confirmation message</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setPaymentStep('instructions')}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        Back to Instructions
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                      >
                        {isSubmitting ? 'Verifying...' : 'Verify Payment'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-2">
              If you're experiencing any issues with payment verification, please contact our support team:
            </p>
            <p className="text-gray-600 text-sm">
              Email: <a href="mailto:support@fairstay.com" className="text-blue-600">support@fairstay.com</a>
            </p>
            <p className="text-gray-600 text-sm">
              Phone: <a href="tel:+263712345678" className="text-blue-600">+263 71 234 5678</a>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 