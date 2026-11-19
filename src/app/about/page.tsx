'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import {
  ShieldCheck,
  Building,
  Truck,
  Armchair,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Users,
} from 'lucide-react';
import PackersMoversModal from '@/components/PackersMoversModal';
import FurnitureModal from '@/components/FurnitureModal';

export default function AboutPage() {
  const [isPackersOpen, setIsPackersOpen] = useState(false);
  const [isFurnitureOpen, setIsFurnitureOpen] = useState(false);

  const areas = [
    {
      name: 'Gurgaon',
      sectors: 'Golf Course Road, Golf Course Extension, DLF Phase 1-5, Sohna Road, New Gurgaon, Dwarka Expressway',
      activeListings: '120+ Listings',
    },
    {
      name: 'South & Central Delhi',
      sectors: 'Vasant Kunj, Saket, Greater Kailash, Hauz Khas, Defence Colony, Dwarka',
      activeListings: '65+ Listings',
    },
    {
      name: 'Noida & Greater Noida',
      sectors: 'Sector 62, Sector 137, Noida Expressway, Sector 150, Gaur City',
      activeListings: '45+ Listings',
    },
    {
      name: 'Faridabad & Ghaziabad',
      sectors: 'Neharpar, Green Field Colony, Indirapuram, Raj Nagar Extension',
      activeListings: '30+ Listings',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Hero / Our Story */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-[#E59A38] uppercase tracking-wider">
          About Rent With You
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1B2A4A] mt-3 tracking-tight">
          Rent, Buy and Move - All In One Place
        </h1>
        <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
          Founded in Gurgaon, <b>Rent With You</b> was born out of a simple conviction: finding a home, renting a flat, or relocating your life shouldn’t feel like an endless maze of chaotic WhatsApp groups, misleading photos, and untracked broker calls.
        </p>
      </div>

      {/* 2. Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#E59A38] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            <Building size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#1B2A4A]">Verified Properties</h3>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Every flat, villa, and commercial shop is reviewed by our operations desk. Real photographs, actual rents, and transparent specs.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            <Truck size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#1B2A4A]">Packers & Movers</h3>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Moving to your new house? We coordinate doorstep packing, delicate item crating, multi-layer bubble wrap, and safe transit.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#1F8A5B] text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
            <Armchair size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#1B2A4A]">Furniture Rental & Buying</h3>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            Need beds, sofas, or an entire 2 BHK furnished? Choose flexible monthly furniture packages or purchase brand-new designer pieces.
          </p>
        </div>
      </div>

      {/* 3. Areas We Serve */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A]">
            Areas We Serve Across Delhi NCR
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Focusing on the highest-demand residential corridors and commercial tech zones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <div
              key={area.name}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-[#E59A38] mb-2">
                  <MapPin size={18} />
                  <span className="text-base font-extrabold text-[#1B2A4A]">{area.name}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {area.sectors}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                {area.activeListings}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Contact & WhatsApp Callout */}
      <div className="bg-[#1B2A4A] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black">
          Looking for a home or have one to rent out?
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-lg mx-auto">
          Our property experts are available 7 days a week on WhatsApp and call.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink('Hi Rent With You, I would like to speak with a property advisor.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp (+91 9911169115)</span>
          </a>
          <Link
            href="/list-your-property"
            className="px-6 py-3.5 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
          >
            <span>List Your Property Free</span>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <PackersMoversModal isOpen={isPackersOpen} onClose={() => setIsPackersOpen(false)} />
      <FurnitureModal isOpen={isFurnitureOpen} onClose={() => setIsFurnitureOpen(false)} />
    </div>
  );
}
