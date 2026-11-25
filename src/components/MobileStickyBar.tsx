'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { BRAND, getWhatsAppLink } from '@/lib/constants';

export default function MobileStickyBar() {
  const pathname = usePathname();

  // Keep admin workspace unobstructed
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        <a
          href={`tel:${BRAND.phone}`}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-300 bg-white text-[#1B2A4A] font-bold text-sm active:scale-[0.98] transition"
        >
          <Phone size={16} className="text-[#1B2A4A]" />
          <span>Call now</span>
        </a>

        <a
          href={getWhatsAppLink('Hi Rent With You, I am looking for a property in Gurgaon. Please assist.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-bold text-sm shadow-xs active:scale-[0.98] transition"
        >
          <MessageCircle size={16} />
          <span>WhatsApp us</span>
        </a>
      </div>
    </div>
  );
}
