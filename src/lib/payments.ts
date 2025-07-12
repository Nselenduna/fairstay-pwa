import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Interface for payment verification request
 */
interface PaymentVerificationRequest {
  transactionId: string;
  phoneNumber: string;
  userId: string;
  amount?: number;
}

/**
 * Interface for payment transaction data
 */
interface PaymentTransaction {
  id: string;
  userId: string;
  phoneNumber: string;
  amount: number;
  status: 'pending' | 'verified' | 'failed';
  paymentMethod: 'ecocash' | 'other';
  timestamp: any;
  verificationDate?: any;
}

/**
 * Verify a payment transaction
 * @param paymentData Payment verification request data
 * @returns Promise that resolves to boolean indicating verification success
 */
export async function verifyPayment(paymentData: PaymentVerificationRequest): Promise<boolean> {
  try {
    // In a real implementation, this would call an API to verify the transaction
    // For demo purposes, we'll simulate a successful verification
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, consider all transactions valid if they have the right format
    const isValidTransaction = 
      paymentData.transactionId.length >= 8 && 
      paymentData.phoneNumber.length >= 10;
    
    if (isValidTransaction) {
      // Store the transaction in Firestore
      await storePaymentTransaction({
        id: paymentData.transactionId,
        userId: paymentData.userId,
        phoneNumber: paymentData.phoneNumber,
        amount: paymentData.amount || 5, // Default to $5 if not specified
        status: 'verified',
        paymentMethod: 'ecocash',
        timestamp: serverTimestamp(),
        verificationDate: serverTimestamp()
      });
      
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

/**
 * Store payment transaction in Firestore
 * @param transaction Payment transaction data
 */
async function storePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
  try {
    // Store in transactions collection
    const { id, ...transactionData } = transaction;
    await updateDoc(doc(db, 'transactions', transaction.id), transactionData);
    
    // Update user's payment status
    await updateDoc(doc(db, 'users', transaction.userId), {
      isPaid: true,
      paymentDate: serverTimestamp(),
      lastPaymentId: transaction.id
    });
  } catch (error) {
    console.error('Error storing transaction:', error);
    throw error;
  }
}

/**
 * Check if a user's payment is still valid
 * @param userId User ID to check
 * @returns Promise that resolves to boolean indicating if payment is valid
 */
export async function checkPaymentValidity(userId: string): Promise<boolean> {
  // In a real implementation, this would check if the subscription is still active
  // For demo purposes, we'll assume all payments are valid indefinitely once made
  return true;
}

/**
 * Format currency amount for display
 * @param amount Amount to format
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
} 