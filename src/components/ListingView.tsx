'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property, PropertyCategory } from '@/types';
import { fetchProperties } from '@/lib/propertyStore';
import PropertyCard from '@/components/PropertyCard';
import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';

interface ListingViewProps {
  category: PropertyCategory;
  pageTitle: string;
  pageSubtitle: string;
}

function ListingViewInner({ category, pageTitle, pageSubtitle }: ListingViewProps) {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states initialized from searchParams
  const [location, setLocation] = useState(searchParams.get('location') || searchParams.get('city') || 'All areas');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || searchParams.get('property_type') || 'Any');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any');
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || 'Any');
  const [priceMax, setPriceMax] = useState<number>(() => {
    const budget = searchParams.get('budget');
    if (budget && !isNaN(Number(budget))) return Number(budget);
    return category === 'rent' ? 60000 : category === 'buy' ? 20000000 : 300000;
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const data = await fetchProperties(category);
      if (isMounted) {
        setProperties(data);
        setLoading(false);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [category]);

  const handleResetFilters = () => {
    setLocation('All areas');
    setPropertyType('Any');
    setBedrooms('Any');
    setFurnishing('Any');
    setPriceMax(category === 'rent' ? 60000 : category === 'buy' ? 20000000 : 300000);
    setSortBy('newest');
  };

  // Filtered and Sorted properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Location filter
    if (location && location !== 'All areas') {
      const q = location.toLowerCase();
      result = result.filter(
        (p) =>
          p.area.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.landmark && p.landmark.toLowerCase().includes(q))
      );
    }

    // Property type filter
    if (propertyType && propertyType !== 'Any') {
      result = result.filter((p) =>
        p.property_type.toLowerCase().includes(propertyType.toLowerCase())
      );
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== 'Any') {
      result = result.filter((p) =>
        p.bedrooms.toLowerCase().includes(bedrooms.toLowerCase())
      );
    }

    // Furnishing filter
    if (furnishing && furnishing !== 'Any') {
      result = result.filter(
        (p) => p.furnishing.toLowerCase() === furnishing.toLowerCase()
      );
    }

    // Price Max filter
    if (priceMax > 0) {
      result = result.filter((p) => p.price <= priceMax);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Newest
      result.sort(
        (a, b) =>
          new Date(b.created_at || '').getTime() -
          new Date(a.created_at || '').getTime()
      );
    }

    return result;
  }, [properties, location, propertyType, bedrooms, furnishing, priceMax, sortBy]);

  const priceLabel = category === 'rent'
    ? `Up to Rs. ${priceMax.toLocaleString('en-IN')} / mo`
    : category === 'buy'
    ? `Up to Rs. ${(priceMax / 100000).toFixed(0)} Lakh`
    : `Up to Rs. ${priceMax.toLocaleString('en-IN')}`;

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">{pageTitle}</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{pageSubtitle}</p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between bg-[#FAF8F5] p-3 rounded-xl border border-gray-200">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-2 text-xs font-bold text-[#1B2A4A]"
        >
          <SlidersHorizontal size={16} className="text-[#E59A38]" />
          <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
        <span className="text-xs text-gray-600 font-medium">
          {filteredProperties.length} properties
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* LEFT SIDEBAR FILTERS (Matches Wireframe Page 6) */}
        <aside
          className={`lg:block bg-[#FAF8F5] rounded-2xl p-6 border border-gray-200 shadow-xs ${
            mobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-200/80 mb-5">
            <h2 className="text-lg font-bold text-[#1B2A4A] flex items-center gap-2">
              <Filter size={18} className="text-[#E59A38]" />
              <span>Filters</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-[#1B2A4A] flex items-center gap-1 transition"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4 text-xs font-medium text-gray-700">
            {/* Location */}
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
              >
                <option value="All areas">All areas</option>
                <option value="Sector 57">Sector 57, Gurgaon</option>
                <option value="Sector 54">Sector 54, Golf Course Rd</option>
                <option value="Sector 48">Sector 48, Sohna Road</option>
                <option value="Sushant Lok 1">Sushant Lok 1</option>
                <option value="DLF Phase 4">DLF Phase 4</option>
                <option value="DLF Phase 5">DLF Phase 5</option>
                <option value="Sector 67">Sector 67, Golf Course Ext</option>
                <option value="Sector 85">Sector 85, New Gurgaon</option>
                <option value="Cyber City">Cyber City, DLF Phase 2</option>
                <option value="Delhi">Delhi</option>
                <option value="Noida">Noida</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">Property type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
              >
                <option value="Any">Any</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="Independent Floor">Independent Floor</option>
                <option value="Studio Room">Studio Room</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Shop">Shop / Retail</option>
                <option value="Office">Office Space</option>
                <option value="Warehouse">Warehouse / Industrial</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
              >
                <option value="Any">Any</option>
                <option value="Studio">Studio</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4+ BHK">4+ BHK</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-gray-800 font-bold mb-1.5">Furnishing</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
              >
                <option value="Any">Any</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-800 font-bold">
                  {category === 'rent' ? 'Rent range' : 'Price range'}
                </label>
                <span className="text-[11px] font-bold text-[#E59A38]">
                  {priceLabel}
                </span>
              </div>
              <input
                type="range"
                min={category === 'rent' ? 5000 : category === 'buy' ? 2000000 : 10000}
                max={category === 'rent' ? 100000 : category === 'buy' ? 30000000 : 500000}
                step={category === 'rent' ? 2000 : category === 'buy' ? 500000 : 10000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#E59A38] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Min</span>
                <span>
                  {category === 'rent' ? 'Rs. 1 Lakh' : category === 'buy' ? 'Rs. 3 Cr' : 'Rs. 5 Lakh'}
                </span>
              </div>
            </div>

            {/* Apply filters Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs transition shadow-sm"
              >
                Apply filters
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="lg:col-span-3">
          {/* Header bar: Dynamic Count + Sort by */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-200">
            <div>
              <span className="text-lg sm:text-xl font-bold text-[#1B2A4A]">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
                className="text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#E59A38]"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF8F5] rounded-3xl border border-gray-200 p-8">
              <Search size={40} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No properties match your filters</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try widening your location or adjusting your budget range to discover available properties.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingView(props: ListingViewProps) {
  return (
    <Suspense fallback={<div className="w-full max-w-[1760px] mx-auto p-12 text-center text-sm text-gray-500">Loading listings...</div>}>
      <ListingViewInner {...props} />
    </Suspense>
  );
}
