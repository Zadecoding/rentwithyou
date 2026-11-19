'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { fetchProperties } from '@/lib/propertyStore';
import { Property } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import { Heart, Search } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds, count } = useWishlist();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchProperties();
      setAllProperties(data);
      setLoading(false);
    }
    load();
  }, []);

  const savedProperties = allProperties.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart size={22} className="fill-rose-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">My Wishlist</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {count} {count === 1 ? 'property' : 'properties'} saved for later
          </p>
        </div>

        <Link
          href="/rent"
          className="text-xs font-bold text-[#E59A38] hover:underline hidden sm:block"
        >
          Explore more properties &gt;
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : savedProperties.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
          <Heart size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Your wishlist is empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            Click the heart icon on any rental or sale property to save it to your wishlist and review anytime.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/rent"
              className="px-6 py-3 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold shadow-xs hover:bg-[#142038]"
            >
              Browse Rentals
            </Link>
            <Link
              href="/buy"
              className="px-6 py-3 rounded-xl bg-[#E59A38] text-white text-xs font-bold shadow-xs hover:bg-[#d68b2a]"
            >
              Browse Homes to Buy
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
