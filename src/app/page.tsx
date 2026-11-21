'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchProperties } from '@/lib/propertyStore';
import { Property, PropertyCategory } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import PackersMoversModal from '@/components/PackersMoversModal';
import FurnitureModal from '@/components/FurnitureModal';
import {
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Clock,
  Truck,
  Armchair,
  Key,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const ROTATING_WORDS = ['home', 'luxury flat', 'dream villa', 'studio room', 'office space'];

const LIVE_UPDATES = [
  { icon: '⚡', text: 'Verified 3 BHK Apartment listed in Sector 57, Gurgaon' },
  { icon: '🔥', text: 'Instant Move-in Studio available on Golf Course Road' },
  { icon: '✨', text: 'Verified Deal closed in DLF Phase 5 today' },
  { icon: '🚚', text: 'Packers & Movers completed 8 seamless shifts this week' },
  { icon: '🏢', text: 'Grade-A Commercial Office leased in Cyber City' },
  { icon: '⭐', text: '4.9/5 Renter Satisfaction across 500+ families' },
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

  // Animated rotating word in hero
  const [wordIndex, setWordIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsWordVisible(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsWordVisible(true);
      }, 200);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Modals
  const [isPackersModalOpen, setIsPackersModalOpen] = useState(false);
  const [isFurnitureModalOpen, setIsFurnitureModalOpen] = useState(false);

  // Properties state
  const [rentalProperties, setRentalProperties] = useState<Property[]>([]);
  const [buyProperties, setBuyProperties] = useState<Property[]>([]);
  const [rentalPage, setRentalPage] = useState(1);
  const [buyPage, setBuyPage] = useState(1);
  const [rentalBudgetFilter, setRentalBudgetFilter] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const rents = await fetchProperties('rent');
      const buys = await fetchProperties('buy');
      setRentalProperties(rents);
      setBuyProperties(buys);
    }
    loadData();
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

  // Filter rentals on home page if quick chip is clicked
  const filteredRentals = rentalBudgetFilter
    ? rentalProperties.filter((p) => p.price >= rentalBudgetFilter)
    : rentalProperties;

  // Pagination for rentals (4 per page)
  const rentalsPerPage = 4;
  const totalRentalPages = Math.max(1, Math.ceil(filteredRentals.length / rentalsPerPage));
  const currentRentals = filteredRentals.slice(
    (rentalPage - 1) * rentalsPerPage,
    rentalPage * rentalsPerPage
  );

  // Pagination for buy (4 per page)
  const buyPerPage = 4;
  const totalBuyPages = Math.max(1, Math.ceil(buyProperties.length / buyPerPage));
  const currentBuys = buyProperties.slice(
    (buyPage - 1) * buyPerPage,
    buyPage * buyPerPage
  );

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* 1. HERO SECTION */}
      <section className="relative px-3 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-8">
        <div className="w-full max-w-[1760px] mx-auto rounded-3xl bg-gradient-to-br from-[#121c33] via-[#1B2A4A] to-[#16223b] text-white overflow-hidden shadow-2xl relative px-6 py-12 sm:py-20 sm:px-12 xl:px-16 2xl:px-20 border border-white/10">
          {/* Animated Ambient Glowing Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E59A38]/20 rounded-full blur-3xl animate-pulse-subtle pointer-events-none" />
          <div className="absolute -bottom-32 -right-24 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-2xl animate-float pointer-events-none" />

          {/* Architectural Background Texture */}
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80')",
            }}
          />

          <div className="relative z-10 max-w-5xl xl:max-w-6xl mx-auto text-center">
            {/* Live Verified Tag / Shimmer Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-gray-200 mb-6 shadow-sm shimmer-badge hover:bg-white/15 transition cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>100% Verified Properties in Gurgaon</span>
            </div>

            {/* Main Headline with Dynamic Rotating Word */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Find your next{' '}
              <span
                className={`inline-block text-[#E59A38] transition-all duration-300 transform ${
                  isWordVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 -translate-y-2 scale-95'
                }`}
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed">
              with the widest choice of rentals, homes and commercial spaces across Gurgaon &amp; NCR
            </p>

            {/* Interactive Tabbed Search Box */}
            <div className="mt-8 glass-panel rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/15 text-left transition-all duration-300 hover:border-white/25">
              {/* Tabs: Rent | Buy | Commercial */}
              <div className="flex items-center space-x-6 border-b border-white/15 pb-4 mb-5">
                {(['rent', 'buy', 'commercial'] as PropertyCategory[]).map((tab) => {
                  const isSelected = activeTab === tab;
                  const label = tab.charAt(0).toUpperCase() + tab.slice(1);
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`text-base sm:text-lg font-bold pb-2 transition-all relative cursor-pointer ${
                        isSelected
                          ? 'text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {label}
                      {isSelected && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E59A38] rounded-full shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Subtitle inside search box */}
              <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-gray-300 font-medium">
                <span>Search properties to {activeTab}</span>
                <span className="text-[11px] text-gray-400 hidden sm:inline">Gurgaon, Sohna Road, Golf Course Ext</span>
              </div>

              <form onSubmit={handleHeroSearch} className="space-y-4">
                {/* Main Search Row: Text Input + Search Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                      placeholder="Enter area, sector (e.g. Sector 57, DLF Phase 5, Golf Course Rd)"
                      className="w-full py-3.5 pl-4 pr-10 text-gray-900 bg-white rounded-xl border-0 shadow-inner text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E59A38] font-medium transition"
                    />
                    <Search
                      size={18}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#E59A38] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#E59A38] to-[#d68b2a] hover:from-[#d68b2a] hover:to-[#c47b1f] text-white font-extrabold text-base transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </div>

                {/* Filter Dropdowns: Budget, Property type, Bedrooms, Furnishing */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {/* Budget Dropdown */}
                  <div className="relative">
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full appearance-none bg-[#203152] hover:bg-[#283e68] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#E59A38] cursor-pointer transition"
                    >
                      <option value="any">Budget</option>
                      {activeTab === 'rent' ? (
                        <>
                          <option value="10000">Up to Rs. 10,000</option>
                          <option value="20000">Up to Rs. 20,000</option>
                          <option value="35000">Up to Rs. 35,000</option>
                          <option value="50000">Up to Rs. 50,000</option>
                          <option value="50000+">Rs. 50,000+</option>
                        </>
                      ) : activeTab === 'buy' ? (
                        <>
                          <option value="50lakh">Up to Rs. 50 Lakh</option>
                          <option value="1cr">Up to Rs. 1 Crore</option>
                          <option value="2cr">Up to Rs. 2 Crore</option>
                          <option value="5cr+">Rs. 5 Crore+</option>
                        </>
                      ) : (
                        <>
                          <option value="30000">Up to Rs. 30,000</option>
                          <option value="75000">Up to Rs. 75,000</option>
                          <option value="150000">Up to Rs. 1.5 Lakh</option>
                          <option value="300000+">Rs. 3 Lakh+</option>
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

            {/* Hero Key Trust Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 max-w-md mx-auto gap-3 mt-8">
              <div className="glass-panel rounded-2xl p-3.5 sm:p-4 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#E59A38]/50 group">
                <Star size={20} className="mx-auto text-amber-300 mb-1 group-hover:scale-110 transition-transform fill-amber-300" />
                <p className="text-lg sm:text-xl font-black text-white">4.9 / 5</p>
                <p className="text-[11px] text-gray-300 font-medium">500+ Happy Renters</p>
              </div>

              <div className="glass-panel rounded-2xl p-3.5 sm:p-4 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#E59A38]/50 group">
                <Clock size={20} className="mx-auto text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-lg sm:text-xl font-black text-white">15 Min</p>
                <p className="text-[11px] text-gray-300 font-medium">Instant Response</p>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 animate-bounce">
              <span>Scroll down to explore Gurgaon properties</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Live Activity Marquee Ticker */}
      <section className="border-y border-amber-200/50 bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-amber-50/60 py-2.5 overflow-hidden marquee-container">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee marquee-content">
          {[...LIVE_UPDATES, ...LIVE_UPDATES].map((item, i) => (
            <div key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700">
              <span className="text-sm">{item.icon}</span>
              <span>{item.text}</span>
              <span className="text-amber-400 ml-4 font-bold">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. "WHAT DO YOU NEED TODAY?" QUICK SERVICES SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#E59A38] uppercase tracking-wider">
            Quick Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] mt-1">
            What do you need today?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Tailored services designed to make your move seamless, fast and reliable
          </p>
        </div>

        {/* 4 Animated Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Packers & Movers */}
          <div className="group relative bg-[#FAF8F5] rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:border-[#E59A38]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E59A38] transition-all duration-300" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E59A38] to-[#c78225] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Truck size={26} />
              </div>
              <h3 className="text-lg font-black text-[#1B2A4A] group-hover:text-[#E59A38] transition-colors">
                Packers &amp; Movers
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Hassle-free home shifting with verified logistics partners &amp; insurance support.
              </p>
            </div>
            <button
              onClick={() => setIsPackersModalOpen(true)}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] group-hover:bg-[#E59A38] text-white font-bold text-xs transition-colors duration-300 text-center shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Get a Free Quote</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Furniture */}
          <div className="group relative bg-[#FAF8F5] rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:border-[#E59A38]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E59A38] transition-all duration-300" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-[#1B2A4A] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Armchair size={26} />
              </div>
              <h3 className="text-lg font-black text-[#1B2A4A] group-hover:text-[#E59A38] transition-colors">
                Furniture
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Rent or buy modern designer sofas, beds, workstations &amp; home appliances.
              </p>
            </div>
            <button
              onClick={() => setIsFurnitureModalOpen(true)}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] group-hover:bg-[#E59A38] text-white font-bold text-xs transition-colors duration-300 text-center shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Browse Furniture</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Rent */}
          <div className="group relative bg-[#FAF8F5] rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:border-[#E59A38]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E59A38] transition-all duration-300" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B2A4A] to-[#253961] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Key size={26} />
              </div>
              <h3 className="text-lg font-black text-[#1B2A4A] group-hover:text-[#E59A38] transition-colors">
                Rent
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Verified flats, builder floors, shared rooms &amp; independent houses in Gurgaon.
              </p>
            </div>
            <Link
              href="/rent"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] group-hover:bg-[#E59A38] text-white font-bold text-xs transition-colors duration-300 text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Search Rentals</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 4: Buy */}
          <div className="group relative bg-[#FAF8F5] rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:border-[#E59A38]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E59A38] transition-all duration-300" />
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Building2 size={26} />
              </div>
              <h3 className="text-lg font-black text-[#1B2A4A] group-hover:text-[#E59A38] transition-colors">
                Buy
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Top new launches, gated communities, luxury villas &amp; high-yield investment plots.
              </p>
            </div>
            <Link
              href="/buy"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] group-hover:bg-[#E59A38] text-white font-bold text-xs transition-colors duration-300 text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Search to Buy</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Brand Value Banner */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 group">
          {/* Left: Illustrated Home Box with Animated Floating Elements */}
          <div className="w-full lg:w-5/12 bg-gradient-to-br from-[#121c33] via-[#1B2A4A] to-[#253961] rounded-3xl p-8 flex items-center justify-center relative overflow-hidden min-h-[260px] border border-white/10">
            {/* Glowing Ambient Backdrop */}
            <div className="w-48 h-48 rounded-full bg-[#E59A38]/20 absolute animate-pulse-subtle blur-2xl" />
            <div className="w-32 h-32 rounded-full bg-blue-500/20 absolute -top-8 -right-8 animate-float-slow blur-xl" />

            {/* Floating Live Badge Top-Left */}
            <div className="absolute top-4 left-4 z-20 animate-float bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-white shadow-md">
              <ShieldCheck size={12} className="text-[#E59A38]" />
              <span>100% Verified</span>
            </div>

            {/* Floating Live Badge Bottom-Right */}
            <div className="absolute bottom-4 right-4 z-20 animate-float-slow bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-white shadow-md">
              <Zap size={12} className="text-amber-400" />
              <span>Direct Deal</span>
            </div>

            {/* Stylized Modern House with Hover Effects */}
            <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform duration-500">
              {/* Animated Live Ping on Rooftop */}
              <div className="relative mb-[-4px] z-20">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E59A38] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E59A38]" />
                </span>
              </div>
              {/* Roof */}
              <div
                className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[42px] border-b-[#E59A38] drop-shadow-md"
              />
              {/* House Base */}
              <div className="w-24 h-20 bg-white rounded-b-md flex items-center justify-center shadow-xl relative overflow-hidden">
                {/* Windows & Door */}
                <div className="flex gap-2 items-end">
                  <div className="w-4 h-5 bg-slate-200 rounded-xs border border-slate-300" />
                  <div className="w-7 h-11 bg-gradient-to-t from-[#E59A38] to-[#f0b05b] rounded-t-sm shadow-inner" />
                  <div className="w-4 h-5 bg-slate-200 rounded-xs border border-slate-300" />
                </div>
              </div>
              <span className="text-[10px] text-amber-200/90 font-bold mt-3 tracking-widest uppercase">
                Rent • Buy • Move
              </span>
            </div>
          </div>

          {/* Right: Description & Bullet Badges */}
          <div className="w-full lg:w-7/12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-[#E59A38] text-xs font-bold mb-3">
              <Sparkles size={13} />
              <span>All-In-One Real Estate Ecosystem</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] leading-tight">
              Rent, buy and move &mdash; <span className="text-[#E59A38]">all in one place</span>
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Rent With You helps you find homes, rooms and commercial spaces from owners and
              trusted dealers. Search, save your favourites, and chat with us on WhatsApp. We can
              also help with packers and movers, and furniture for your new home.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-800">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#E59A38]/30 transition">
                <CheckCircle2 size={16} className="text-[#E59A38] shrink-0" />
                <span>Direct Owner Listings</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#E59A38]/30 transition">
                <CheckCircle2 size={16} className="text-[#E59A38] shrink-0" />
                <span>Instant WhatsApp Help</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#E59A38]/30 transition">
                <CheckCircle2 size={16} className="text-[#E59A38] shrink-0" />
                <span>Packers &amp; Furniture</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/rent"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-bold text-sm transition shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Explore Properties</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/list-your-property"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1B2A4A] font-bold text-sm transition hover:scale-105 active:scale-95"
              >
                <span>Post Your Property</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOME PAGE CATEGORY SHOWCASE */}
      <section className="py-12 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full max-w-[1760px] mx-auto space-y-16">
        {/* CATEGORY 1: RENTAL PROPERTIES */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#E59A38] text-white font-extrabold text-sm shadow-md ring-4 ring-[#E59A38]/20 animate-pulse-subtle">
                1
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
                Rental properties
              </h2>
            </div>
            <Link
              href="/rent"
              className="text-sm font-bold text-[#1B2A4A] hover:text-[#E59A38] transition flex items-center gap-1.5 group"
            >
              <span>View all rentals</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Budget Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => {
                setRentalBudgetFilter(null);
                setRentalPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                rentalBudgetFilter === null
                  ? 'bg-[#1B2A4A] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Rentals
            </button>
            {[
              { label: 'Rooms from Rs. 8,000', min: 8000 },
              { label: '1 BHK from Rs. 12,000', min: 12000 },
              { label: '2 BHK from Rs. 18,000', min: 18000 },
              { label: '3 BHK from Rs. 28,000', min: 28000 },
            ].map((chip) => {
              const active = rentalBudgetFilter === chip.min;
              return (
                <button
                  key={chip.min}
                  onClick={() => {
                    setRentalBudgetFilter(chip.min);
                    setRentalPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                    active
                      ? 'bg-[#1B2A4A] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Rental Properties Grid */}
          {currentRentals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentRentals.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FAF8F5] rounded-3xl border border-gray-200 p-8">
              <p className="text-sm font-bold text-gray-800">No approved rental properties available right now</p>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Properties appear here once approved by our team. Are you an owner or agent?
              </p>
              <Link
                href="/list-your-property"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#1B2A4A] hover:bg-[#E59A38] text-white text-xs font-bold transition shadow-xs"
              >
                List Your Property
              </Link>
            </div>
          )}

          {/* Rental Pagination */}
          {totalRentalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalRentalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setRentalPage(pg)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 ${
                    rentalPage === pg
                      ? 'bg-[#1B2A4A] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pg}
                </button>
              ))}
              {rentalPage < totalRentalPages && (
                <button
                  onClick={() => setRentalPage((p) => Math.min(totalRentalPages, p + 1))}
                  className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition cursor-pointer"
                >
                  Next
                </button>
              )}
              <button
                onClick={() => setRentalPage(totalRentalPages)}
                className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition cursor-pointer"
              >
                Last &gt;
              </button>
            </div>
          )}
        </div>

        {/* CATEGORY 2: BUY - NEW PROJECTS */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#E59A38] text-white font-extrabold text-sm shadow-md ring-4 ring-[#E59A38]/20 animate-pulse-subtle">
                2
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
                Buy - new projects
              </h2>
            </div>
            <Link
              href="/buy"
              className="text-sm font-bold text-[#1B2A4A] hover:text-[#E59A38] transition flex items-center gap-1.5 group"
            >
              <span>View all projects</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 pl-12">
            New launches, ready-to-move homes and plots
          </p>

          {/* Buy Properties Grid */}
          {currentBuys.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentBuys.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FAF8F5] rounded-3xl border border-gray-200 p-8">
              <p className="text-sm font-bold text-gray-800">No approved buy properties available right now</p>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Properties appear here once approved by our team. Are you an owner or agent?
              </p>
              <Link
                href="/list-your-property"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#1B2A4A] hover:bg-[#E59A38] text-white text-xs font-bold transition shadow-xs"
              >
                List Your Property
              </Link>
            </div>
          )}

          {/* Buy Pagination */}
          {totalBuyPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalBuyPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setBuyPage(pg)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 ${
                    buyPage === pg
                      ? 'bg-[#1B2A4A] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pg}
                </button>
              ))}
              {buyPage < totalBuyPages && (
                <button
                  onClick={() => setBuyPage((p) => Math.min(totalBuyPages, p + 1))}
                  className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition cursor-pointer"
                >
                  Next
                </button>
              )}
              <button
                onClick={() => setBuyPage(totalBuyPages)}
                className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition cursor-pointer"
              >
                Last &gt;
              </button>
            </div>
          )}
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
