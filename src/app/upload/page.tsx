"use client";

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { getCurrentLocation } from '@/lib/geo';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    amenities: [''],
    status: 'available',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  
  // Get user's location
  const handleGetLocation = async () => {
    try {
      const position = await getCurrentLocation();
      setLocation(position);
      setLocationError('');
    } catch (error) {
      setLocationError('Failed to get your location. Please try again or enter manually.');
    }
  };
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  // Remove an image
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle amenity changes
  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };
  
  // Add new amenity field
  const addAmenityField = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }));
  };
  
  // Remove amenity field
  const removeAmenityField = (index: number) => {
    const newAmenities = [...formData.amenities];
    newAmenities.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    if (!location) {
      alert('Please provide your location');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images to storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `listings/${user.uid}/${Date.now()}-${image.name}`);
          const snapshot = await uploadBytes(storageRef, image);
          return getDownloadURL(snapshot.ref);
        })
      );
      
      // Save listing to Firestore
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        images: imageUrls,
        location,
        amenities: formData.amenities.filter(item => item.trim() !== ''),
        status: formData.status,
        createdAt: serverTimestamp(),
        ownerId: user.uid
      };
      
      const docRef = await addDoc(collection(db, 'listings'), listingData);
      
      // Redirect to the new listing
      router.push(`/listing/${docRef.id}`);
      
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">You need to be logged in to create a listing</h1>
          <button 
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Cozy 2-bedroom apartment near downtown"
          />
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (per month)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Describe your property..."
          />
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                >
                  <span>Upload images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          
          {/* Image previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleGetLocation}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
            >
              Get Current Location
            </button>
            {location && (
              <span className="text-green-600 text-sm">
                Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </span>
            )}
          </div>
          {locationError && <p className="mt-1 text-sm text-red-600">{locationError}</p>}
        </div>
        
        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amenities
          </label>
          {formData.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={amenity}
                onChange={(e) => handleAmenityChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., WiFi, Air Conditioning, etc."
              />
              <button
                type="button"
                onClick={() => removeAmenityField(index)}
                disabled={formData.amenities.length === 1}
                className="bg-red-500 text-white px-3 py-2 rounded-md disabled:bg-gray-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAmenityField}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Another Amenity
          </button>
        </div>
        
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="available">Available</option>
            <option value="taken">Taken</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:bg-blue-400"
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
} 