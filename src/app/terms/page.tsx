import React from 'react';
import { Metadata } from 'next';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Rent With You',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
      <h1 className="text-3xl font-black text-[#1B2A4A] mb-4">Terms & Conditions</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: January 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h2 className="text-base font-bold text-[#1B2A4A]">1. Agreement to Terms</h2>
        <p>
          By accessing or using the website <b>Rent With You</b> ({BRAND.name}), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our platform.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">2. Property Listings & Accuracy</h2>
        <p>
          Property owners and authorized agents certify that all property photographs, rental rates, sale prices, and amenities listed are authentic and currently available. Rent With You reserves the right to reject or remove listings that violate truthfulness standards.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">3. Packers & Movers and Furniture Inquiries</h2>
        <p>
          Rent With You acts as a discovery and referral platform connecting customers with verified logistics and furnishing partners. Final quotes and transit terms are formalized directly between parties.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">4. Limitation of Liability</h2>
        <p>
          Rent With You shall not be liable for any indirect, incidental, or consequential damages resulting from rental lease agreements or transactions between property owners and tenants.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">5. Contact Us</h2>
        <p>
          For queries regarding these terms, please contact us at <b>{BRAND.email}</b> or call <b>{BRAND.phone}</b>.
        </p>
      </div>
    </div>
  );
}
