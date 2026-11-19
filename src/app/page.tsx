'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants';
import { fetchProperties } from '@/lib/propertyStore';
import { Property, PropertyCategory } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import PackersMoversModal from '@/components/PackersMoversModal';
import FurnitureModal from '@/components/FurnitureModal';
import {
  Search,
  ChevronDown,
  Building2,
  Home as HomeIcon,
  Briefcase,
  CheckCircle,
  Truck,
  Armchair,
  KeyRound,
  Compass,
} from 'lucide-react';

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
      {/* 1. HERO SECTION (Matches Wireframe Page 1) */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#1B2A4A] text-white overflow-hidden shadow-2xl relative px-6 py-14 sm:py-20 sm:px-12">
          {/* Subtle architectural / home background overlay */}
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80')",
            }}
          />
          <div className="absolute top-4 right-6 text-xs text-slate-400 font-mono tracking-wide hidden sm:block">
            Hero photo: homes / city view
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Find your next <span className="text-[#E59A38]">home</span>
            </h1>
            <p className="mt-4 text-base sm:text-xl text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed">
              with the widest choice of rentals, homes and commercial spaces
            </p>

            {/* Interactive Tabbed Search Box */}
            <div className="mt-8 bg-[#16223b]/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-white/10 text-left">
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
                      className={`text-base sm:text-lg font-bold pb-2 transition relative ${
                        isSelected
                          ? 'text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {label}
                      {isSelected && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E59A38] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Subtitle inside search box */}
              <p className="text-xs sm:text-sm text-gray-300 font-medium mb-3">
                Search properties to {activeTab}
              </p>

              <form onSubmit={handleHeroSearch} className="space-y-4">
                {/* Main Search Row: Text Input + Search Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchArea}
                      onChange={(e) => setSearchArea(e.target.value)}
                      placeholder="Enter area, locality or landmark"
                      className="w-full py-3.5 pl-4 pr-10 text-gray-900 bg-white rounded-xl border-0 shadow-inner text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E59A38] font-medium"
                    />
                    <Search
                      size={18}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-3.5 px-8 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-extrabold text-base transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Search</span>
                  </button>
                </div>

                {/* Filter Pills / Dropdowns matching Wireframe: Budget, Property type, Bedrooms, Furnishing */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {/* Budget Dropdown */}
                  <div className="relative">
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full appearance-none bg-[#203152] hover:bg-[#253961] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-full border border-white/10 focus:outline-none cursor-pointer"
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
                      className="w-full appearance-none bg-[#203152] hover:bg-[#253961] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-full border border-white/10 focus:outline-none cursor-pointer"
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
                      className="w-full appearance-none bg-[#203152] hover:bg-[#253961] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-full border border-white/10 focus:outline-none cursor-pointer"
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
                      className="w-full appearance-none bg-[#203152] hover:bg-[#253961] text-gray-200 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-full border border-white/10 focus:outline-none cursor-pointer"
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

            {/* Scroll Down Indicator */}
            <div className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 animate-bounce">
              <span>Scroll down for more options</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHAT DO YOU NEED TODAY?" QUICK SERVICES SECTION (Matches Wireframe Page 2) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[#1B2A4A] mb-8">
          What do you need today?
        </h2>

        {/* 4 Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Packers & Movers */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                P
              </div>
              <h3 className="text-lg font-bold text-[#1B2A4A]">Packers & Movers</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Trusted packers and movers for your move.
              </p>
            </div>
            <button
              onClick={() => setIsPackersModalOpen(true)}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs transition text-center shadow-xs"
            >
              Get a quote
            </button>
          </div>

          {/* Card 2: Furniture */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                F
              </div>
              <h3 className="text-lg font-bold text-[#1B2A4A]">Furniture</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Buy or rent furniture for your new home.
              </p>
            </div>
            <button
              onClick={() => setIsFurnitureModalOpen(true)}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs transition text-center shadow-xs"
            >
              Browse furniture
            </button>
          </div>

          {/* Card 3: Rent */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                R
              </div>
              <h3 className="text-lg font-bold text-[#1B2A4A]">Rent</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Flats, houses and rooms for rent.
              </p>
            </div>
            <Link
              href="/rent"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs transition text-center shadow-xs block"
            >
              Search rentals
            </Link>
          </div>

          {/* Card 4: Buy */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                B
              </div>
              <h3 className="text-lg font-bold text-[#1B2A4A]">Buy</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Homes and plots to buy.
              </p>
            </div>
            <Link
              href="/buy"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs transition text-center shadow-xs block"
            >
              Search to buy
            </Link>
          </div>
        </div>

        {/* Brand Value Banner (Matches Wireframe Page 2) */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left: Illustrated Home Box */}
          <div className="w-full lg:w-5/12 bg-[#1B2A4A] rounded-2xl p-8 flex items-center justify-center relative overflow-hidden min-h-[240px]">
            {/* Background design elements matching wireframe */}
            <div className="w-24 h-24 rounded-full bg-[#24365d] absolute left-6 opacity-60" />
            <div className="w-24 h-24 rounded-full bg-[#24365d] absolute right-6 opacity-60" />

            {/* Stylized Modern House */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Roof */}
              <div
                className="w-0 h-0 border-l-[45px] border-l-transparent border-r-[45px] border-r-transparent border-b-[38px] border-b-[#E59A38]"
              />
              {/* House Base */}
              <div className="w-20 h-16 bg-white rounded-b-sm flex items-center justify-center shadow-md">
                {/* Door / Window */}
                <div className="w-6 h-9 bg-[#E59A38] rounded-t-sm" />
              </div>
              <span className="text-[10px] text-gray-400 mt-4 tracking-wider uppercase">
                Rent • Buy • Move
              </span>
            </div>
          </div>

          {/* Right: Description & Bullet Badges */}
          <div className="w-full lg:w-7/12">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
              Rent, buy and move - all in one place
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Rent With You helps you find homes, rooms and commercial spaces from owners and
              trusted dealers. Search, save your favourites, and chat with us on WhatsApp. We can
              also help with packers and movers, and furniture for your new home.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38]" />
                <span>Homes from owners and dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38]" />
                <span>Easy WhatsApp enquiry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38]" />
                <span>Moving and furniture help</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/rent"
                className="inline-block px-7 py-3 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-bold text-sm transition shadow-sm"
              >
                Explore properties
              </Link>
            </div>
          </div>
        </div>

        {/* Sub-bar with contact info (Page 2 wireframe bottom line) */}
        <div className="mt-8 bg-[#1B2A4A] text-white py-3 px-6 rounded-xl flex flex-col md:flex-row items-center justify-between text-xs gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-300">
            <span className="font-bold text-white">Rent With You</span>
            <span>|</span>
            <span>Phone/WhatsApp: {BRAND.phone}</span>
            <span className="hidden sm:inline">|</span>
            <span>Email: {BRAND.email}</span>
            <span className="hidden lg:inline">|</span>
            <span className="hidden lg:inline">Instagram: {BRAND.instagram}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 text-xs">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/list-your-property" className="hover:text-white">For Owner & Developer</Link>
            <Link href="/rent" className="hover:text-white">Rent</Link>
            <Link href="/buy" className="hover:text-white">Buy</Link>
            <Link href="/commercial" className="hover:text-white">Commercial</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </div>
      </section>

      {/* 3. HOME PAGE CATEGORY SHOWCASE (Matches Wireframe Page 3) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* CATEGORY 1: RENTAL PROPERTIES */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#E59A38] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                1
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
                Rental properties
              </h2>
            </div>
            <Link
              href="/rent"
              className="text-sm font-bold text-[#1B2A4A] hover:text-[#E59A38] transition flex items-center gap-1"
            >
              <span>View all rentals</span>
              <span>&gt;</span>
            </Link>
          </div>

          {/* Quick Budget Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => {
                setRentalBudgetFilter(null);
                setRentalPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                rentalBudgetFilter === null
                  ? 'bg-[#1B2A4A] text-white shadow-xs'
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
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                    active
                      ? 'bg-[#1B2A4A] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Rental Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentRentals.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>

          {/* Rental Pagination */}
          {totalRentalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalRentalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setRentalPage(pg)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                    rentalPage === pg
                      ? 'bg-[#1B2A4A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pg}
                </button>
              ))}
              {rentalPage < totalRentalPages && (
                <button
                  onClick={() => setRentalPage((p) => Math.min(totalRentalPages, p + 1))}
                  className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
                >
                  Next
                </button>
              )}
              <button
                onClick={() => setRentalPage(totalRentalPages)}
                className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
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
              <span className="w-8 h-8 rounded-full bg-[#E59A38] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                2
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
                Buy - new projects
              </h2>
            </div>
            <Link
              href="/buy"
              className="text-sm font-bold text-[#1B2A4A] hover:text-[#E59A38] transition flex items-center gap-1"
            >
              <span>View all projects</span>
              <span>&gt;</span>
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 pl-11">
            New launches, ready-to-move homes and plots
          </p>

          {/* Buy Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentBuys.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>

          {/* Buy Pagination */}
          {totalBuyPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalBuyPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setBuyPage(pg)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                    buyPage === pg
                      ? 'bg-[#1B2A4A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pg}
                </button>
              ))}
              {buyPage < totalBuyPages && (
                <button
                  onClick={() => setBuyPage((p) => Math.min(totalBuyPages, p + 1))}
                  className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
                >
                  Next
                </button>
              )}
              <button
                onClick={() => setBuyPage(totalBuyPages)}
                className="px-3 h-9 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold"
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
