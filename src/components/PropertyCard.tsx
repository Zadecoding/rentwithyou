'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Property } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { formatRupeeLabel, parsePropertySpecs } from '@/lib/constants';
import { Heart, MapPin, Camera } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className = '' }: PropertyCardProps) {
  const router = useRouter();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(property.id);

  const specs = parsePropertySpecs(property);

  const rawImages =
    property.images && Array.isArray(property.images) && property.images.length > 0
      ? property.images.filter(Boolean)
      : [];

  const rawImageSrc =
    rawImages.length > 0
      ? rawImages[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=75';

  // Optimize Unsplash thumbnail URLs to reduce download payload
  const imageSrc = rawImageSrc.includes('images.unsplash.com')
    ? rawImageSrc.replace(/w=\d+/, 'w=600').replace(/q=\d+/, 'q=75')
    : rawImageSrc;

  const photoCount = rawImages.length || 1;
  const propertyUrl = `/property/${property.property_code || property.id}`;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    router.push(propertyUrl);
  };

  // Format rupee price cleanly, separating suffix like "/ month" or "onwards"
  const formattedPrice = formatRupeeLabel(property.price_label);
  const priceParts = formattedPrice.match(/^([^/]+?)(\s*\/\s*month|\s+onwards)?$/i);
  const mainPrice = priceParts?.[1]?.trim() || formattedPrice;
  const priceSuffix = priceParts?.[2]?.trim() || '';

  // Build deposit / brokerage subline
  const sublineParts: string[] = [];
  if (specs.deposit) {
    const dep = specs.deposit.startsWith('₹') ? specs.deposit : `₹${specs.deposit.replace(/^Rs\.?\s*/i, '')}`;
    sublineParts.push(`Deposit ${dep}`);
  }
  if (specs.no_brokerage || property.listed_by_role === 'Owner') {
    sublineParts.push('No brokerage');
  }

  // Fact pills (avoiding repeating bedrooms twice)
  const factPills: string[] = [];
  if (specs.area_sqft) {
    factPills.push(specs.area_sqft);
  } else if (property.property_type && !property.title.toLowerCase().includes(property.property_type.toLowerCase())) {
    factPills.push(property.property_type);
  }
  if (property.furnishing && property.furnishing !== 'N/A') {
    factPills.push(property.furnishing);
  }
  if (specs.floor) {
    factPills.push(specs.floor);
  }
  const availabilityLabel =
    !property.available_from || property.available_from.toLowerCase() === 'immediate'
      ? 'Ready to move'
      : property.available_from;
  factPills.push(availabilityLabel);

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        {/* Top Image Container */}
        <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            loading="lazy"
            unoptimized
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top-left subtle badge (Calm Ivory pill with emerald dot) */}
          {property.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#1B2A4A] text-[11px] font-bold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {property.badge}
              </span>
            </div>
          )}

          {/* Top-right Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property.id);
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-rose-600 hover:scale-110 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Heart
              size={16}
              className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}
            />
          </button>

          {/* Bottom-right Photo Count Pill */}
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold">
              <Camera size={11} className="opacity-85" />
              <span>
                {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
              </span>
            </span>
          </div>
        </div>

        {/* Rich Card Content */}
        <div className="p-4 sm:p-5">
          {/* Price with ₹ sign */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-sans text-xl font-extrabold text-[#1B2A4A] tracking-tight">
              {mainPrice}
            </span>
            {priceSuffix && (
              <span className="text-xs font-medium text-gray-500">{priceSuffix}</span>
            )}
          </div>

          {/* Deposit / No brokerage subline */}
          {sublineParts.length > 0 && (
            <p className="text-[11px] font-medium text-gray-500 mt-0.5">
              {sublineParts.join(' · ')}
            </p>
          )}

          {/* Clear Title */}
          <h3 className="font-sans text-base font-bold text-[#1B2A4A] group-hover:text-[#C99342] transition-colors line-clamp-1 mt-2">
            {property.title}
          </h3>

          {/* Location */}
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
            <MapPin size={12} className="text-gray-400 shrink-0" />
            <span className="truncate">
              {property.area}
              {property.city && !property.area.toLowerCase().includes(property.city.toLowerCase())
                ? `, ${property.city}`
                : ''}
            </span>
          </p>

          {/* Fact Pills Row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
            {factPills.slice(0, 4).map((fact, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-gray-200/70 text-[11px] font-semibold text-gray-700"
              >
                {fact}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
