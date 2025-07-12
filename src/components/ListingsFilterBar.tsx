import React from 'react';
import { AdjustmentsHorizontalIcon, CurrencyDollarIcon, MapPinIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ListingsFilterBarProps {
  status: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  sort: string;
  onStatusChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

export default function ListingsFilterBar({
  status,
  minPrice,
  maxPrice,
  location,
  sort,
  onStatusChange,
  onMinPriceChange,
  onMaxPriceChange,
  onLocationChange,
  onSortChange,
  onClear,
}: ListingsFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-gradient-to-r from-indigo-50 to-pink-50 p-6 rounded-2xl shadow-elevated mb-10 border border-indigo-100">
      {/* Status Filter */}
      <div className="relative w-full md:w-44 flex items-center">
        <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none z-10" />
        <label htmlFor="status-filter" className="sr-only">Status</label>
        <select
          id="status-filter"
          value={status}
          onChange={e => onStatusChange(e.target.value)}
          className="w-full pl-14 pr-10 py-2 h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all appearance-none leading-tight"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="taken">Taken</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
        {/* Custom dropdown arrow */}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
      {/* Price Range - Min */}
      <div className="relative w-full md:w-32 flex items-center">
        <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none z-10" />
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => onMinPriceChange(e.target.value)}
          className="w-full pl-14 pr-4 py-2 h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all leading-tight"
        />
      </div>
      <span className="hidden md:inline text-gray-400">-</span>
      {/* Price Range - Max */}
      <div className="relative w-full md:w-32 flex items-center">
        <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none z-10" />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => onMaxPriceChange(e.target.value)}
          className="w-full pl-14 pr-4 py-2 h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all leading-tight"
        />
      </div>
      {/* Location Search */}
      <div className="relative w-full md:w-56 flex items-center">
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Location or keyword"
          value={location}
          onChange={e => onLocationChange(e.target.value)}
          className="w-full pl-14 pr-4 py-2 h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all leading-tight"
        />
      </div>
      {/* Sort Dropdown */}
      <div className="relative w-full md:w-44 flex items-center">
        <ArrowDownTrayIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none z-10" />
        <label htmlFor="sort-filter" className="sr-only">Sort</label>
        <select
          id="sort-filter"
          value={sort}
          onChange={e => onSortChange(e.target.value)}
          className="w-full pl-14 pr-10 py-2 h-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all appearance-none leading-tight"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        {/* Custom dropdown arrow */}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </div>
      {/* Clear Filters */}
      <button
        onClick={onClear}
        className="btn btn-secondary ml-0 md:ml-4 rounded-xl px-6 py-2 shadow hover:bg-indigo-100 hover:text-indigo-700 transition-all w-full md:w-auto"
      >
        Clear Filters
      </button>
    </div>
  );
} 