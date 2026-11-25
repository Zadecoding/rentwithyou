'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import {
  MapPin,
  Mail,
  Phone,
  ArrowUp,
  MessageCircle,
  Plus,
  Minus,
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import PackersMoversModal from './PackersMoversModal';
import Logo from './Logo';
import FurnitureModal from './FurnitureModal';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isPackersModalOpen, setIsPackersModalOpen] = useState(false);
  const [isFurnitureModalOpen, setIsFurnitureModalOpen] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const rentCities = [
    { name: 'Gurgaon', href: '/rent?city=Gurgaon' },
    { name: 'Delhi', href: '/rent?city=Delhi' },
    { name: 'Noida', href: '/rent?city=Noida' },
    { name: 'Faridabad', href: '/rent?city=Faridabad' },
    { name: 'Ghaziabad', href: '/rent?city=Ghaziabad' },
  ];

  const popularLinks = (
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
          className="hover:text-[#E59A38] transition text-left cursor-pointer"
        >
          Packers &amp; Movers
        </button>
      </li>
      <li>
        <button
          onClick={() => setIsFurnitureModalOpen(true)}
          className="hover:text-[#E59A38] transition text-left cursor-pointer"
        >
          Furniture
        </button>
      </li>
    </ul>
  );

  const companyLinks = (
    <ul className="space-y-2 text-xs text-gray-300">
      <li>
        <Link href="/about" className="hover:text-[#E59A38] transition block">
          About Us
        </Link>
      </li>
      <li>
        <Link href="/contact" className="hover:text-[#E59A38] transition block">
          Contact Us
        </Link>
      </li>
      <li>
        <Link href="/list-your-property" className="hover:text-[#E59A38] transition block">
          List Your Property
        </Link>
      </li>
      <li>
        <Link href="/blogs" className="hover:text-[#E59A38] transition block">
          Blogs
        </Link>
      </li>
    </ul>
  );

  const citiesLinks = (
    <ul className="space-y-2 text-xs text-gray-300">
      {rentCities.map((city) => (
        <li key={city.name}>
          <Link href={city.href} className="hover:text-[#E59A38] transition block">
            Rent in {city.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const policyLinks = (
    <ul className="space-y-2 text-xs text-gray-300">
      <li>
        <Link href="/faqs" className="hover:text-[#E59A38] transition block">
          FAQs
        </Link>
      </li>
      <li>
        <Link href="/terms" className="hover:text-[#E59A38] transition block">
          Terms &amp; Conditions
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
  );

  const mobileAccordionGroups = [
    { id: 'popular', title: 'Popular searches', content: popularLinks },
    { id: 'company', title: 'Company', content: companyLinks },
    { id: 'cities', title: 'Rent in cities', content: citiesLinks },
    { id: 'policies', title: 'Help & policies', content: policyLinks },
  ];

  return (
    <>
      <footer className="bg-[#1B2A4A] text-white pt-12 pb-24 md:pt-16 md:pb-12 border-t-2 border-[#E59A38]/80">
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
          {/* Proud Trust Numbers Strip (Replaces Visitor Counter) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pb-8 mb-8 border-b border-white/10 max-w-2xl">
            <div>
              <span className="font-heading text-xl sm:text-2xl font-bold text-white block">
                500+
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400">families moved</span>
            </div>
            <div>
              <span className="font-heading text-xl sm:text-2xl font-bold text-white block">
                4.9 <span className="text-[#E59A38]">&#9733;</span>
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400">renter rating</span>
            </div>
            <div>
              <span className="font-heading text-xl sm:text-2xl font-bold text-white block">
                100%
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400">verified homes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 pb-10 border-b border-white/10">
            {/* Brand Info (Always visible on mobile & desktop) */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-block" aria-label="Rent With You - Home">
                <Logo variant="light" height={46} className="hover:opacity-90 transition-opacity" />
              </Link>

              <div className="space-y-2 text-xs text-gray-300 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#E59A38] shrink-0 mt-0.5" />
                  <span>{BRAND.address}</span>
                </div>

                <div className="hidden md:flex items-center gap-2.5">
                  <Mail size={15} className="text-[#E59A38] shrink-0" />
                  <a href={`mailto:${BRAND.email}`} className="hover:text-[#E59A38] transition">
                    {BRAND.email}
                  </a>
                </div>

                <div className="hidden md:flex items-center gap-2.5">
                  <Phone size={15} className="text-[#E59A38] shrink-0" />
                  <a href={`tel:${BRAND.phone}`} className="hover:text-[#E59A38] transition font-medium">
                    {BRAND.phone} (call and WhatsApp)
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <InstagramIcon size={15} className="text-[#E59A38] shrink-0" />
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

            {/* Mobile Accordion Links (Folds open when tapped) */}
            <div className="md:hidden divide-y divide-white/10 border-t border-white/10">
              {mobileAccordionGroups.map((group) => {
                const isOpen = openSection === group.id;
                return (
                  <div key={group.id} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleSection(group.id)}
                      className="w-full flex items-center justify-between text-left text-sm font-semibold text-white cursor-pointer"
                    >
                      <span>{group.title}</span>
                      <span className="text-gray-400">
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                    {isOpen && <div className="pt-3 pl-1">{group.content}</div>}
                  </div>
                );
              })}
            </div>

            {/* Desktop Link Columns */}
            <div className="hidden md:block">
              <h4 className="font-sans text-sm font-bold text-white mb-4">Popular searches</h4>
              {popularLinks}
            </div>

            <div className="hidden md:block">
              <h4 className="font-sans text-sm font-bold text-white mb-4">Company &amp; Cities</h4>
              {companyLinks}
              <div className="mt-5 pt-4 border-t border-white/10">
                <h5 className="font-sans text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Rent in Cities
                </h5>
                {citiesLinks}
              </div>
            </div>

            <div className="hidden md:block">
              <h4 className="font-sans text-sm font-bold text-white mb-4">Help &amp; policies</h4>
              {policyLinks}
            </div>
          </div>

          {/* Bottom Bar: Copyright & Back-to-Top */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              {BRAND.copyright}
            </p>

            <div className="hidden md:flex items-center gap-4">
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
                className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-[#E59A38] hover:border-[#E59A38] hover:text-white transition flex items-center justify-center text-gray-300 cursor-pointer"
                aria-label="Back to top"
                title="Back to Top"
              >
                <ArrowUp size={16} />
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
