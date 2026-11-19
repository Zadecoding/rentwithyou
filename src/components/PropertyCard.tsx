'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(property.id);

  // Badge styling matching design specifications
  const getBadgeStyle = (badge: string | undefined | null) => {
    switch (badge) {
      case 'Verified':
        return 'bg-[#E59A38] text-white';
      case 'New':
        return 'bg-blue-600 text-white';
      case 'New launch':
        return 'bg-emerald-600 text-white';
      case 'Ready':
        return 'bg-amber-600 text-white';
      case 'Premium':
        return 'bg-purple-700 text-white';
      case 'Plots':
        return 'bg-teal-700 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const imageSrc =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';

  const isBuyOrProject = property.category === 'buy';
  const ctaText = isBuyOrProject ? 'Details' : 'View';
  const propertyUrl = `/property/${property.property_code || property.id}`;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badge */}
          {property.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-lg shadow-sm ${getBadgeStyle(
                  property.badge
                )}`}
              >
                {property.badge}
              </span>
            </div>
          )}

          {/* Wishlist Heart Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property.id);
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-rose-600 hover:scale-110 shadow-md transition-all duration-200"
          >
            <Heart
              size={18}
              className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}
            />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <Link href={propertyUrl} className="block group-hover:text-[#E59A38] transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-[#1B2A4A] line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Specs line: Bedrooms | Furnishing / Status | Area */}
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span>{property.bedrooms !== 'N/A' ? property.bedrooms : property.property_type}</span>
            <span className="text-gray-300">•</span>
            <span>{property.furnishing !== 'N/A' ? property.furnishing : property.available_from}</span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-0.5 text-gray-600 font-medium truncate max-w-[140px]">
              <MapPin size={12} className="text-[#E59A38] shrink-0" />
              {property.area}
            </span>
          </p>
        </div>
      </div>

      {/* Card Footer: Price & View CTA */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 flex items-center justify-between border-t border-gray-100 mt-2">
        <div>
          <span className="text-xs text-gray-500 block">Price</span>
          <span className="text-base sm:text-lg font-extrabold text-[#1B2A4A]">
            {property.price_label}
          </span>
        </div>

        <Link
          href={propertyUrl}
          className="px-4 py-2 rounded-xl bg-[#1B2A4A] text-white hover:bg-[#142038] text-xs sm:text-sm font-bold transition shadow-xs hover:shadow-md"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
