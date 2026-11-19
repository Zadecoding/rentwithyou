import React from 'react';
import { Metadata } from 'next';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rent With You',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
      <h1 className="text-3xl font-black text-[#1B2A4A] mb-4">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: January 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h2 className="text-base font-bold text-[#1B2A4A]">1. Information We Collect</h2>
        <p>
          We collect personal information that you provide to us when submitting an inquiry, listing a property, or creating an account, including your full name, phone number, email address, property address, and shifting requirements.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">2. How We Use Your Information</h2>
        <p>
          We use your information strictly to connect prospective tenants with verified owners, facilitate WhatsApp discussions, provide accurate quotes for packers and movers or furniture, and safeguard platform security.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">3. Data Security & Storage</h2>
        <p>
          All database records and uploaded photographs are protected with PostgreSQL Row Level Security (RLS) policies and industry-grade SSL encryption via Supabase. We do not sell your personal data to unauthorized third parties.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">4. Contact Our Privacy Officer</h2>
        <p>
          Questions about your personal data can be directed to <b>{BRAND.email}</b>.
        </p>
      </div>
    </div>
  );
}
