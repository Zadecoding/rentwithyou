'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types';
import { fetchPropertyById, fetchProperties } from '@/lib/propertyStore';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import { useWishlist } from '@/context/WishlistContext';
import PropertyCard from '@/components/PropertyCard';
import {
  Heart,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  ChevronRight,
  X,
  Maximize2,
  Check,
  Building,
  Bed,
  Sofa,
  Calendar,
} from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { isWishlisted, toggleWishlist } = useWishlist();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const prop = await fetchPropertyById(id);
      if (prop) {
        setProperty(prop);
        const related = await fetchProperties(prop.category);
        setSimilarProperties(related.filter((p) => p.id !== prop.id).slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#E59A38] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Property Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">
          The property code or ID you are looking for might have been rented out or removed.
        </p>
        <Link
          href="/rent"
          className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-[#1B2A4A] text-white text-sm font-bold"
        >
          Browse All Rentals
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(property.id);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'];

  const currentPhoto = images[selectedPhotoIndex] || images[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const whatsappMessage = `Hi Rent With You, I am interested in Property ID: [${property.property_code}] - ${property.title} in ${property.area}. Please share details and arrange a visit.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb (Matches Wireframe Page 7: Home > Rent > 2 BHK Apartment) */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1B2A4A] transition">
          Home
        </Link>
        <ChevronRight size={14} className="text-gray-400" />
        <Link
          href={`/${property.category}`}
          className="capitalize hover:text-[#1B2A4A] transition"
        >
          {property.category === 'rent'
            ? 'Rent'
            : property.category === 'buy'
            ? 'Buy'
            : 'Commercial'}
        </Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-[#1B2A4A] font-bold truncate max-w-xs">{property.title}</span>
      </nav>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Photo Viewer & Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Photo */}
          <div className="relative aspect-16/10 rounded-3xl overflow-hidden bg-gray-100 shadow-md group">
            <Image
              src={currentPhoto}
              alt={property.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            {/* Click to open Lightbox */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 text-xs font-semibold shadow-md transition"
              title="View full screen photo"
            >
              <Maximize2 size={16} />
              <span className="hidden sm:inline">Expand</span>
            </button>

            {property.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-lg bg-[#E59A38] text-white text-xs font-bold shadow-md">
                  {property.badge}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Thumbnails Gallery (Photo 2, Photo 3, Photo 4...) */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 border-2 transition ${
                    selectedPhotoIndex === idx
                      ? 'border-[#E59A38] ring-2 ring-[#E59A38]/30 scale-95'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 15vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                    Photo {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Property Details & Conversion CTAs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {/* Header & Save / Share */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] leading-tight">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-2 font-medium">
                <MapPin size={16} className="text-[#E59A38] shrink-0" />
                <span>
                  {property.area}, {property.city}
                </span>
              </p>
              {property.landmark && (
                <p className="text-xs text-gray-500 pl-5 mt-0.5">
                  Landmark: {property.landmark}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(property.id)}
                className={`p-2.5 rounded-xl border transition ${
                  wishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Wishlist"
                title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Heart size={20} className={wishlisted ? 'fill-rose-500 text-rose-500' : ''} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition relative"
                aria-label="Share property"
                title="Copy property link"
              >
                {copiedShare ? <Check size={20} className="text-emerald-600" /> : <Share2 size={20} />}
                {copiedShare && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-0.5 rounded shadow">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="py-2 border-y border-gray-100 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-gray-500 block">Expected Price</span>
              <span className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
                {property.price_label}
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Verified Listing
            </span>
          </div>

          {/* 2x2 Key Fact Cards (Matches Wireframe Page 7) */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Type */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-gray-200/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Type
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1B2A4A] mt-1 block">
                {property.property_type}
              </span>
            </div>

            {/* 2. Bedrooms */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-gray-200/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Bedrooms
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1B2A4A] mt-1 block">
                {property.bedrooms !== 'N/A' ? property.bedrooms : 'Studio / Open'}
              </span>
            </div>

            {/* 3. Furnishing */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-gray-200/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Furnishing
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1B2A4A] mt-1 block">
                {property.furnishing}
              </span>
            </div>

            {/* 4. Available from */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-gray-200/80">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Available from
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#1B2A4A] mt-1 block">
                {property.available_from || 'Immediate'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Property Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/60 p-4 rounded-xl border border-gray-100">
              {property.description}
            </p>
          </div>

          {/* Primary Conversion CTAs (Matches Wireframe Page 7) */}
          <div className="space-y-3 pt-2">
            {/* Green Button: Chat on WhatsApp */}
            <a
              href={getWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-extrabold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Dark Navy Button: Call now */}
            <a
              href={`tel:${BRAND.phone}`}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-extrabold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
            >
              <Phone size={18} className="text-[#E59A38]" />
              <span>Call now</span>
            </a>
          </div>

          {/* Metadata line (Matches Wireframe Page 7: Listed by: [Owner / Dealer name] | Property ID: [0001]) */}
          <div className="pt-2 text-center text-xs text-gray-500 font-medium">
            <span>Listed by: <b>{property.owner_name} ({property.listed_by_role})</b></span>
            <span className="mx-2 text-gray-300">|</span>
            <span>Property ID: <b className="font-mono text-gray-800">{property.property_code}</b></span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-[70vh]">
            <Image
              src={currentPhoto}
              alt={property.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Similar / Related Properties */}
      {similarProperties.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#1B2A4A]">Similar Properties</h2>
            <Link
              href={`/${property.category}`}
              className="text-xs sm:text-sm font-bold text-[#E59A38] hover:underline"
            >
              View More in {property.category} &gt;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
