'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import { getVisitorCount } from '@/lib/propertyStore';
import {
  MapPin,
  Mail,
  Phone,
  ArrowUp,
  MessageCircle,
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import PackersMoversModal from './PackersMoversModal';
import FurnitureModal from './FurnitureModal';

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState<number>(BRAND.defaultVisitorCount);
  const [isPackersModalOpen, setIsPackersModalOpen] = useState(false);
  const [isFurnitureModalOpen, setIsFurnitureModalOpen] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getVisitorCount();
      setVisitorCount(count);
    };
    fetchCount();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format visitor counter to 7 digits
  const formattedCount = visitorCount.toString().padStart(7, '0');

  const rentCities = [
    { name: 'Gurgaon', href: '/rent?city=Gurgaon' },
    { name: 'Delhi', href: '/rent?city=Delhi' },
    { name: 'Noida', href: '/rent?city=Noida' },
    { name: 'Faridabad', href: '/rent?city=Faridabad' },
    { name: 'Ghaziabad', href: '/rent?city=Ghaziabad' },
  ];

  const projectCities = [
    { name: 'Gurgaon', href: '/buy?city=Gurgaon' },
    { name: 'Delhi', href: '/buy?city=Delhi' },
    { name: 'Noida', href: '/buy?city=Noida' },
  ];

  return (
    <>
      <footer className="bg-[#1B2A4A] text-white pt-16 pb-12 border-t-4 border-[#E59A38]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-gray-700/60">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E59A38] text-white font-extrabold flex items-center justify-center text-2xl shadow-md">
                  R
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white">
                    Rent With You
                  </h3>
                  <p className="text-[11px] font-bold tracking-widest text-[#E59A38] uppercase">
                    {BRAND.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-300 font-medium">
                Welcome to Rent With You
              </p>

              <div className="space-y-2.5 text-xs text-gray-300 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#E59A38] shrink-0 mt-0.5" />
                  <span>{BRAND.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-[#E59A38] shrink-0" />
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="hover:text-[#E59A38] transition"
                  >
                    {BRAND.email}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-[#E59A38] shrink-0" />
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="hover:text-[#E59A38] transition font-medium"
                  >
                    {BRAND.phone} (call and WhatsApp)
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <InstagramIcon size={16} className="text-[#E59A38] shrink-0" />
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E59A38] transition"
                  >
                    {BRAND.instagram}
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Popular Searches */}
            <div>
              <h4 className="text-base font-bold text-white mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#E59A38]">
                Popular Searches
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <Link href="/rent" className="hover:text-[#E59A38] transition block">
                    Property for Rent
                  </Link>
                </li>
                <li>
                  <Link href="/buy" className="hover:text-[#E59A38] transition block">
                    Property to Buy
                  </Link>
                </li>
                <li>
                  <Link href="/buy?badge=New+launch" className="hover:text-[#E59A38] transition block">
                    New Projects
                  </Link>
                </li>
                <li>
                  <Link href="/rent?role=Dealer" className="hover:text-[#E59A38] transition block">
                    Agent Properties
                  </Link>
                </li>
                <li>
                  <Link href="/rent?type=Apartment" className="hover:text-[#E59A38] transition block">
                    Residential Property
                  </Link>
                </li>
                <li>
                  <Link href="/commercial" className="hover:text-[#E59A38] transition block">
                    Commercial Property
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsPackersModalOpen(true)}
                    className="hover:text-[#E59A38] transition text-left"
                  >
                    Packers & Movers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsFurnitureModalOpen(true)}
                    className="hover:text-[#E59A38] transition text-left"
                  >
                    Furniture
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h4 className="text-base font-bold text-white mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-[#E59A38]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <Link href="/contact" className="hover:text-[#E59A38] transition block">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-[#E59A38] transition block">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-[#E59A38] transition block">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#E59A38] transition block">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#E59A38] transition block">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#E59A38] transition block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[#E59A38] transition block">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-[#E59A38] transition block">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: City Links & Live Visitor Counter */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Rent in Cities
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {rentCities.map((city, idx) => (
                    <span key={city.name}>
                      <Link href={city.href} className="hover:text-[#E59A38] transition">
                        Rent in {city.name}
                      </Link>
                      {idx < rentCities.length - 1 && <span className="mx-1.5 text-gray-500">|</span>}
                    </span>
                  ))}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  New Projects
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {projectCities.map((city, idx) => (
                    <span key={city.name}>
                      <Link href={city.href} className="hover:text-[#E59A38] transition">
                        New projects in {city.name}
                      </Link>
                      {idx < projectCities.length - 1 && <span className="mx-1.5 text-gray-500">|</span>}
                    </span>
                  ))}
                </p>
              </div>

              {/* 7-digit Digital Visitor Counter Box */}
              <div className="pt-2">
                <div className="inline-block bg-[#121c33] border border-gray-700/80 rounded-xl p-3 shadow-inner">
                  <span className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Visitor Counter
                  </span>
                  <div className="flex items-center gap-1">
                    {formattedCount.split('').map((digit, i) => (
                      <span
                        key={i}
                        className="w-7 h-9 flex items-center justify-center bg-black/80 text-[#E59A38] font-mono text-xl font-bold rounded-md border border-gray-800 shadow-sm"
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Back-to-Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              {BRAND.copyright}
            </p>

            <div className="flex items-center gap-4">
              <a
                href={getWhatsAppLink('Hi Rent With You, I have an enquiry.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#1F8A5B] font-semibold hover:underline"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Support</span>
              </a>

              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full border border-gray-600 bg-white/5 hover:bg-[#E59A38] hover:border-[#E59A38] hover:text-white transition flex items-center justify-center text-gray-300"
                aria-label="Back to top"
                title="Back to Top"
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals triggered from footer */}
      <PackersMoversModal
        isOpen={isPackersModalOpen}
        onClose={() => setIsPackersModalOpen(false)}
      />
      <FurnitureModal
        isOpen={isFurnitureModalOpen}
        onClose={() => setIsFurnitureModalOpen(false)}
      />
    </>
  );
}
