'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchProperties, getCachedPropertiesSync } from '@/lib/propertyStore';
import { Property, PropertyCategory } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import PackersMoversModal from '@/components/PackersMoversModal';
import FurnitureModal from '@/components/FurnitureModal';
import {
  Search,
  ChevronDown,
  ShieldCheck,
  Star,
  Truck,
  Armchair,
  Home,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const POPULAR_AREAS = ['Sector 57', 'Golf Course Rd', 'DLF Phase 5'];

const GURGAON_AREAS = [
  {
    name: 'Golf Course Rd',
    query: 'Golf Course',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&auto=format&fit=crop&q=75',
  },
  {
    name: 'DLF Phase 5',
    query: 'DLF Phase 5',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=75',
  },
  {
    name: 'Sohna Road',
    query: 'Sohna Road',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&auto=format&fit=crop&q=75',
  },
  {
    name: 'Sector 57',
    query: 'Sector 57',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&auto=format&fit=crop&q=75',
  },
];

const CUSTOMER_REVIEWS = [
  {
    initial: 'P',
    name: 'Priya S.',
    meta: 'Sector 57 · Rented 2026',
    quote:
      'Moved into our 2 BHK in four days. The flat was exactly like the photos with zero hidden brokerage surprises.',
  },
  {
    initial: 'R',
    name: 'Rahul M.',
    meta: 'Golf Course Rd · Moved 2026',
    quote:
      'Packers handled our fragile glassware and furniture carefully, finishing the entire local shift within 5 hours.',
  },
  {
    initial: 'A',
    name: 'Ananya D.',
    meta: 'DLF Phase 5 · Rented 2026',
    quote:
      'Loved how quick WhatsApp coordination was. Visited three verified flats on Saturday and finalised by evening.',
  },
  {
    initial: 'K',
    name: 'Karan V.',
    meta: 'Sohna Road · Rented 2026',
    quote:
      'Rented a bright semi-furnished apartment along with a bed and sofa package. Smooth single-team support.',
  },
];

export default function HomePage() {
  const router = useRouter();

  // Hero Search State
  const [activeTab, setActiveTab] = useState<PropertyCategory>('rent');
  const [searchArea, setSearchArea] = useState('');
  const [budget, setBudget] = useState('any');
  const [propertyType, setPropertyType] = useState('any');
  const [bedrooms, setBedrooms] = useState('any');
  const [furnishing, setFurnishing] = useState('any');

  // Modals
  const [isPackersModalOpen, setIsPackersModalOpen] = useState(false);
  const [isFurnitureModalOpen, setIsFurnitureModalOpen] = useState(false);

  // Properties state initialized synchronously from cache for 0ms render
  const [rentalProperties, setRentalProperties] = useState<Property[]>(() =>
    getCachedPropertiesSync('rent')
  );
  const [buyProperties, setBuyProperties] = useState<Property[]>(() =>
    getCachedPropertiesSync('buy')
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(
    () => getCachedPropertiesSync().length > 0
  );
  const [rentalBudgetFilter, setRentalBudgetFilter] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const [rents, buys] = await Promise.all([
        fetchProperties('rent'),
        fetchProperties('buy'),
      ]);
      setRentalProperties(rents);
      setBuyProperties(buys);
      setIsLoaded(true);
    }
    void loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchArea.trim()) params.set('location', searchArea.trim());
    if (budget !== 'any') params.set('budget', budget);
    if (propertyType !== 'any') params.set('property_type', propertyType);
    if (bedrooms !== 'any') params.set('bedrooms', bedrooms);
    if (furnishing !== 'any') params.set('furnishing', furnishing);

    router.push(`/${activeTab}?${params.toString()}`);
  };

  const handleQuickAreaSearch = (areaName: string) => {
    const params = new URLSearchParams();
    params.set('location', areaName);
    router.push(`/${activeTab}?${params.toString()}`);
  };

  const allProperties = [...rentalProperties, ...buyProperties];

  // Filter rentals on home page if quick chip is clicked (show up to 8 in swipe row)
  const filteredRentals = (
    rentalBudgetFilter
      ? rentalProperties.filter((p) => p.price >= rentalBudgetFilter)
      : rentalProperties
  ).slice(0, 8);

  const showcaseBuys = buyProperties.slice(0, 8);

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* 1. HERO SECTION (Steady Confident Headline + Shorter Search + 70/20/10 Color Restraint) */}
      <section className="relative px-3 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-6">
        <div className="w-full max-w-[1760px] mx-auto rounded-3xl bg-[#121c33] text-white overflow-hidden shadow-xl relative px-5 py-10 sm:py-16 sm:px-12 xl:px-16 2xl:px-20 border border-white/10">
          {/* Hero Background Home Image */}
          <Image
            src="/images/hero-home.jpg"
            alt="Luxury modern home in Gurgaon"
            fill
            priority
            unoptimized
            className="object-cover object-center pointer-events-none"
          />
          {/* Balanced Navy Gradient Overlay for Readability & Brand Look */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#121c33]/80 via-[#1B2A4A]/70 to-[#121c33]/85 pointer-events-none" />

          <div className="relative z-10 max-w-4xl xl:max-w-5xl mx-auto text-center">
            {/* Subtle Verification Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-gray-200 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Every home personally verified</span>
            </div>

            {/* Steady, Confident Luxury Serif Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Verified homes in{' '}
              <span className="italic text-[#E59A38]">Gurgaon</span>
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-gray-300 font-normal max-w-xl mx-auto leading-relaxed">
              Every flat is visited by our team before it goes live &mdash; direct owners, verified dealers, zero hassle.
            </p>

            {/* Interactive Tabbed Search Box */}
            <div className="mt-7 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/15 text-left">
              {/* Tabs: Rent | Buy | Commercial */}
              <div className="flex items-center space-x-6 border-b border-white/15 pb-3 mb-4">
                {(['rent', 'buy', 'commercial'] as PropertyCategory[]).map((tab) => {
                  const isSelected = activeTab === tab;
                  const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`text-sm sm:text-base font-bold pb-2 transition-all relative cursor-pointer ${
                        isSelected
                          ? 'text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {label}
                      {isSelected && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E59A38] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleHeroSearch} className="space-y-3">
                {/* Main Search Row: Short Hint + Gold Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                      placeholder="Search area or sector"
                      className="w-full py-3 pl-4 pr-10 text-gray-900 bg-white rounded-xl border-0 shadow-inner text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E59A38] font-medium transition"
                    />
                    <Search
                      size={17}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-7 rounded-xl bg-[#C99342] hover:bg-[#b58135] text-white font-bold text-sm sm:text-base transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Search homes</span>
                  </button>
                </div>

                {/* Popular Tappable Area Links */}
                <div className="flex items-center flex-wrap gap-1.5 text-xs text-gray-300 pt-0.5">
                  <span className="text-gray-400">Popular:</span>
                  {POPULAR_AREAS.map((area, idx) => (
                    <React.Fragment key={area}>
                      <button
                        type="button"
                        onClick={() => handleQuickAreaSearch(area)}
                        className="text-gray-200 hover:text-[#E59A38] font-medium underline-offset-2 hover:underline cursor-pointer transition"
                      >
                        {area}
                      </button>
                      {idx < POPULAR_AREAS.length - 1 && (
                        <span className="text-gray-500">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {/* Budget Dropdown with ₹ */}
                  <div className="relative">
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full appearance-none bg-[#203152] hover:bg-[#283e68] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#E59A38] cursor-pointer transition"
                    >
                      <option value="any">Budget</option>
                      {activeTab === 'rent' ? (
                        <>
                          <option value="10000">Up to ₹10,000</option>
                          <option value="20000">Up to ₹20,000</option>
                          <option value="35000">Up to ₹35,000</option>
                          <option value="50000">Up to ₹50,000</option>
                          <option value="50000+">₹50,000+</option>
                        </>
                      ) : activeTab === 'buy' ? (
                        <>
                          <option value="50lakh">Up to ₹50 Lakh</option>
                          <option value="1cr">Up to ₹1 Crore</option>
                          <option value="2cr">Up to ₹2 Crore</option>
                          <option value="5cr+">₹5 Crore+</option>
                        </>
                      ) : (
                        <>
                          <option value="30000">Up to ₹30,000</option>
                          <option value="75000">Up to ₹75,000</option>
                          <option value="150000">Up to ₹1.5 Lakh</option>
                          <option value="300000+">₹3 Lakh+</option>
                        </>
                      )}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full appearance-none bg-[#203152] hover:bg-[#283e68] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#E59A38] cursor-pointer transition"
                    >
                      <option value="any">Property type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Independent Floor">Independent Floor</option>
                      <option value="Studio Room">Studio Room</option>
                      <option value="Villa">Villa</option>
                      <option value="Plot">Plot</option>
                      <option value="Shop">Shop</option>
                      <option value="Office">Office</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Bedrooms Dropdown */}
                  <div className="relative">
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full appearance-none bg-[#203152] hover:bg-[#283e68] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#E59A38] cursor-pointer transition"
                    >
                      <option value="any">Bedrooms</option>
                      <option value="Studio">Studio</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Furnishing Dropdown */}
                  <div className="relative">
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value)}
                      className="w-full appearance-none bg-[#203152] hover:bg-[#283e68] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#E59A38] cursor-pointer transition"
                    >
                      <option value="any">Furnishing</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-furnished">Semi-furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Single Calm Line (Replaces Moving Emoji Strip) */}
      <section className="border-y border-gray-200/80 bg-[#FAF8F5] py-2.5 px-4">
        <div className="max-w-[1760px] mx-auto flex items-center justify-center gap-2 text-xs font-medium text-gray-700 text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C99342] shrink-0" />
          <span>8 families moved in this week with Rent With You</span>
        </div>
      </section>

      {/* 2. SERVICES AS A NEAT 2x2 GRID WITH MATCHING NAVY+GOLD ICONS & CLEAN LINKS */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
        <div className="mb-6 sm:mb-8">
          <span className="text-[11px] font-bold text-[#9A7130] uppercase tracking-widest block">
            How we help
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-1">
            Everything for your move
          </h2>
        </div>

        {/* 2x2 on Phone, 4 columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Card 1: Rent */}
          <Link
            href="/rent"
            className="group bg-[#FAF8F5] rounded-2xl p-4 sm:p-6 border border-gray-200/80 hover:border-[#1B2A4A]/30 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] text-[#E59A38] flex items-center justify-center mb-3.5">
                <Home size={19} strokeWidth={1.75} />
              </div>
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#1B2A4A]">
                Rent
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Verified flats &amp; floors
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1B2A4A] underline underline-offset-4 decoration-gray-300 group-hover:decoration-[#C99342] transition">
              <span>Explore</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Card 2: Buy */}
          <Link
            href="/buy"
            className="group bg-[#FAF8F5] rounded-2xl p-4 sm:p-6 border border-gray-200/80 hover:border-[#1B2A4A]/30 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] text-[#E59A38] flex items-center justify-center mb-3.5">
                <Building2 size={19} strokeWidth={1.75} />
              </div>
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#1B2A4A]">
                Buy
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                New launches &amp; villas
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1B2A4A] underline underline-offset-4 decoration-gray-300 group-hover:decoration-[#C99342] transition">
              <span>Explore</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Card 3: Packers & Movers */}
          <button
            type="button"
            onClick={() => setIsPackersModalOpen(true)}
            className="group bg-[#FAF8F5] rounded-2xl p-4 sm:p-6 border border-gray-200/80 hover:border-[#1B2A4A]/30 hover:shadow-md transition flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] text-[#E59A38] flex items-center justify-center mb-3.5">
                <Truck size={19} strokeWidth={1.75} />
              </div>
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#1B2A4A]">
                Packers
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Insured home shifting
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1B2A4A] underline underline-offset-4 decoration-gray-300 group-hover:decoration-[#C99342] transition">
              <span>Get quote</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>

          {/* Card 4: Furniture */}
          <button
            type="button"
            onClick={() => setIsFurnitureModalOpen(true)}
            className="group bg-[#FAF8F5] rounded-2xl p-4 sm:p-6 border border-gray-200/80 hover:border-[#1B2A4A]/30 hover:shadow-md transition flex flex-col justify-between text-left cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1B2A4A] text-[#E59A38] flex items-center justify-center mb-3.5">
                <Armchair size={19} strokeWidth={1.75} />
              </div>
              <h3 className="font-sans text-base sm:text-lg font-bold text-[#1B2A4A]">
                Furniture
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Rent sofas, beds &amp; more
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1B2A4A] underline underline-offset-4 decoration-gray-300 group-hover:decoration-[#C99342] transition">
              <span>Browse</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* 3. RENTAL PROPERTIES SWIPE ROW (Single-line Filters, Horizontal Swipe on Phone, "See all" instead of Page Numbers) */}
      {(rentalProperties.length > 0 || !isLoaded) && (
        <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold text-[#9A7130] uppercase tracking-widest block">
                Ready to move in
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-0.5">
                Homes for rent
              </h2>
            </div>
            <Link
              href="/rent"
              className="text-xs sm:text-sm font-bold text-[#1B2A4A] hover:text-[#C99342] underline underline-offset-4 decoration-gray-300 transition shrink-0"
            >
              See all
            </Link>
          </div>

          {/* Single Horizontal Swipeable Filter Row */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-5">
            <button
              onClick={() => setRentalBudgetFilter(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                rentalBudgetFilter === null
                  ? 'bg-[#1B2A4A] text-white'
                  : 'bg-[#FAF8F5] border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              All
            </button>
            {[
              { label: 'Rooms · ₹8k+', min: 8000 },
              { label: '1 BHK · ₹12k+', min: 12000 },
              { label: '2 BHK · ₹18k+', min: 18000 },
              { label: '3 BHK · ₹28k+', min: 28000 },
            ].map((chip) => {
              const active = rentalBudgetFilter === chip.min;
              return (
                <button
                  key={chip.min}
                  onClick={() => setRentalBudgetFilter(chip.min)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                    active
                      ? 'bg-[#1B2A4A] text-white'
                      : 'bg-[#FAF8F5] border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Horizontal Swipe Row on Phone, 4-Column Grid on Desktop */}
          {filteredRentals.length > 0 ? (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 no-scrollbar">
              {filteredRentals.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  className="w-[82vw] max-w-[320px] sm:w-auto sm:max-w-none shrink-0 snap-start"
                />
              ))}
            </div>
          ) : isLoaded ? (
            <div className="bg-[#FAF8F5] rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-xs font-medium text-gray-600">
                No homes found above this budget right now.
              </p>
              <button
                onClick={() => setRentalBudgetFilter(null)}
                className="mt-2 text-xs font-bold text-[#1B2A4A] underline underline-offset-4 cursor-pointer"
              >
                Show all rental homes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-80 rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. BUY SECTION — HIDDEN AUTOMATICALLY WHEN NO APPROVED BUY HOMES EXIST */}
      {showcaseBuys.length > 0 && (
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <span className="text-[11px] font-bold text-[#9A7130] uppercase tracking-widest block">
                Handpicked
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-0.5">
                New projects &amp; homes to buy
              </h2>
            </div>
            <Link
              href="/buy"
              className="text-xs sm:text-sm font-bold text-[#1B2A4A] hover:text-[#C99342] underline underline-offset-4 decoration-gray-300 transition shrink-0"
            >
              See all
            </Link>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 no-scrollbar">
            {showcaseBuys.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                className="w-[82vw] max-w-[320px] sm:w-auto sm:max-w-none shrink-0 snap-start"
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. GURGAON'S BEST ADDRESSES (Explore by Area Photo Swipe Row) */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#9A7130] uppercase tracking-widest block">
              Explore by area
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-0.5">
              Gurgaon&apos;s best addresses
            </h2>
          </div>
          <Link
            href="/rent"
            className="text-xs sm:text-sm font-bold text-[#1B2A4A] hover:text-[#C99342] underline underline-offset-4 decoration-gray-300 transition shrink-0"
          >
            All areas
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-5 no-scrollbar">
          {GURGAON_AREAS.map((area) => {
            const matchCount = allProperties.filter((p) =>
              p.area.toLowerCase().includes(area.query.toLowerCase())
            ).length;
            const subtitle =
              matchCount > 0
                ? `${matchCount} verified ${matchCount === 1 ? 'home' : 'homes'}`
                : 'Explore verified homes';

            return (
              <Link
                key={area.name}
                href={`/rent?location=${encodeURIComponent(area.query)}`}
                className="group relative w-[64vw] max-w-[260px] lg:w-auto lg:max-w-none h-56 sm:h-64 rounded-2xl overflow-hidden shrink-0 snap-start shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 1024px) 65vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121c33]/90 via-[#121c33]/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-heading text-lg sm:text-xl font-bold leading-snug">
                    {area.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5 font-medium">{subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. REAL CUSTOMER REVIEWS SECTION (Swipe Row on Phone, 4 Columns on Desktop) */}
      <section className="py-12 sm:py-16 bg-[#FAF8F5] border-y border-gray-200/70">
        <div className="px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
          <div className="mb-6 sm:mb-8">
            <span className="text-[11px] font-bold text-[#9A7130] uppercase tracking-widest block">
              Renters say
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] mt-0.5">
              Trusted by 500+ families
            </h2>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-5 no-scrollbar">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.name}
                className="w-[78vw] max-w-[310px] lg:w-auto lg:max-w-none bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between shrink-0 snap-start"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-[#C99342] mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} className="fill-[#C99342]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-gray-200 text-[#1B2A4A] font-bold text-xs flex items-center justify-center shrink-0">
                    {rev.initial}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B2A4A]">{rev.name}</p>
                    <p className="text-[11px] text-gray-500">{rev.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALM BRAND VALUE BANNER (70% Navy, 20% Ivory, 10% Gold) */}
      <section className="py-12 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-5/12 bg-[#1B2A4A] rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[220px] text-center">
            <ShieldCheck size={32} className="text-[#E59A38] mb-3" />
            <p className="font-heading text-2xl font-bold text-white">
              What you see is what you get
            </p>
            <p className="text-xs text-gray-300 mt-2 max-w-xs leading-relaxed">
              Every home is physically checked by our Gurgaon team before going live.
            </p>
          </div>

          <div className="w-full lg:w-7/12">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] leading-tight">
              A home you&apos;ll love <span className="italic text-[#C99342]">coming back to</span>
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Rent With You helps you find homes, rooms and commercial spaces from owners and
              trusted dealers. Search, save your favourites, and connect on WhatsApp &mdash; plus
              insured packers &amp; furniture when you move in.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-gray-800">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200/60">
                <CheckCircle2 size={15} className="text-[#1B2A4A] shrink-0" />
                <span>Direct Owner Listings</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200/60">
                <CheckCircle2 size={15} className="text-[#1B2A4A] shrink-0" />
                <span>Instant WhatsApp Help</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200/60">
                <CheckCircle2 size={15} className="text-[#1B2A4A] shrink-0" />
                <span>Packers &amp; Furniture</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-5">
              <Link
                href="/rent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C99342] hover:bg-[#b58135] text-white font-bold text-sm transition shadow-sm"
              >
                <span>Search homes</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/list-your-property"
                className="text-sm font-bold text-[#1B2A4A] underline underline-offset-4 decoration-gray-300 hover:decoration-[#C99342] transition"
              >
                Post your property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <PackersMoversModal
        isOpen={isPackersModalOpen}
        onClose={() => setIsPackersModalOpen(false)}
      />
      <FurnitureModal
        isOpen={isFurnitureModalOpen}
        onClose={() => setIsFurnitureModalOpen(false)}
      />
    </div>
  );
}
