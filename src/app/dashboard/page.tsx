"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: 'available' | 'taken' | 'withdrawn';
  createdAt: any;
  images: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPaid: boolean;
  trialStartDate: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isTrialActive, trialDaysLeft: contextTrialDays } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('myListings');
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'trial' | 'paid' | 'expired'>('trial');
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Calculate trial status
    if (user.trialStartDate) {
      const trialStart = new Date(user.trialStartDate.seconds * 1000);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - trialStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const daysLeft = 7 - diffDays;
      
      setTrialDaysLeft(contextTrialDays || (daysLeft > 0 ? daysLeft : 0));
      
      if (user.isPaid) {
        setPaymentStatus('paid');
      } else if (daysLeft > 0) {
        setPaymentStatus('trial');
      } else {
        setPaymentStatus('expired');
      }
    }

    fetchUserListings();
    
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [user, router, isAdmin, contextTrialDays]);

  const fetchUserListings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'listings'),
        where('ownerId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const listingsData: Listing[] = [];
      
      querySnapshot.forEach((doc) => {
        listingsData.push({
          id: doc.id,
          ...doc.data()
        } as Listing);
      });
      
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      
      querySnapshot.forEach((doc) => {
        usersData.push({
          id: doc.id,
          ...doc.data()
        } as User);
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateListingStatus = async (listingId: string, newStatus: 'available' | 'taken' | 'withdrawn') => {
    setStatusUpdating(listingId);
    try {
      await updateDoc(doc(db, 'listings', listingId), {
        status: newStatus
      });
      
      // Update local state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing.id === listingId ? { ...listing, status: newStatus } : listing
        )
      );
    } catch (error) {
      console.error('Error updating listing status:', error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const updateUserPaymentStatus = async (userId: string, isPaid: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isPaid
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isPaid } : user
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'taken':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Payment Status Banner */}
      {paymentStatus !== 'paid' && (
        <div className={`mb-6 p-4 rounded-md ${
          paymentStatus === 'trial' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
        }`}>
          {paymentStatus === 'trial' ? (
            <p>
              <span className="font-semibold">Trial Active:</span> You have {trialDaysLeft} days left in your free trial.
              <button 
                onClick={() => router.push('/payment')}
                className="ml-4 bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
              >
                Upgrade Now
              </button>
            </p>
          ) : (
            <p>
              <span className="font-semibold">Trial Expired:</span> Your free trial has ended. Please upgrade to continue using all features.
              <button 
                onClick={() => router.push('/payment')}
                className="ml-4 bg-red-600 text-white px-4 py-1 rounded-md text-sm"
              >
                Upgrade Now
              </button>
            </p>
          )}
        </div>
      )}
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('myListings')}
            className={`pb-4 px-1 ${
              activeTab === 'myListings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Listings
          </button>
          
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-4 px-1 ${
              activeTab === 'account'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Account
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab('adminUsers')}
              className={`pb-4 px-1 ${
                activeTab === 'adminUsers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Users
            </button>
          )}
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab('adminListings')}
              className={`pb-4 px-1 ${
                activeTab === 'adminListings'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Listings
            </button>
          )}
        </nav>
      </div>
      
      {/* My Listings Tab */}
      {activeTab === 'myListings' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Listings</h2>
            <button
              onClick={() => router.push('/upload')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add New Listing
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">You haven't created any listings yet</p>
              <button
                onClick={() => router.push('/upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative">
                            {listing.images && listing.images.length > 0 ? (
                              <Image
                                src={listing.images[0]}
                                alt={listing.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${listing.price}/month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(listing.status)}`}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Status Dropdown */}
                          <div className="relative inline-block text-left">
                            <select
                              value={listing.status}
                              onChange={(e) => updateListingStatus(listing.id, e.target.value as any)}
                              disabled={statusUpdating === listing.id}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                              aria-label="Change listing status"
                            >
                              <option value="available">Available</option>
                              <option value="taken">Taken</option>
                              <option value="withdrawn">Withdrawn</option>
                            </select>
                            
                            {statusUpdating === listing.id && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* View Button */}
                          <button
                            onClick={() => router.push(`/listing/${listing.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Account Tab */}
      {activeTab === 'account' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your personal details and account status.</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.displayName}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone || 'Not provided'}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Account status</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    {user.isPaid ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid Account
                      </span>
                    ) : isTrialActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Trial ({trialDaysLeft} days left)
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Trial Expired
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {!user.isPaid && (
            <div className="mt-6">
              <button
                onClick={() => router.push('/payment')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Upgrade to Paid Account
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Admin Users Tab */}
      {activeTab === 'adminUsers' && isAdmin && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          
          {users.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isPaid ? 'Paid' : 'Trial'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => updateUserPaymentStatus(user.id, !user.isPaid)}
                          className={`${
                            user.isPaid
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.isPaid ? 'Mark as Trial' : 'Mark as Paid'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Admin Listings Tab */}
      {activeTab === 'adminListings' && isAdmin && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Listings</h2>
          
          {/* Admin listings implementation */}
        </div>
      )}
    </div>
  );
} 