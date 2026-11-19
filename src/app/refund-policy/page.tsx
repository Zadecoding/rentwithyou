import React from 'react';
import { Metadata } from 'next';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Refund Policy | Rent With You',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
      <h1 className="text-3xl font-black text-[#1B2A4A] mb-4">Refund & Cancellation Policy</h1>
      <p className="text-xs text-gray-500 mb-6">Last updated: January 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h2 className="text-base font-bold text-[#1B2A4A]">1. Free Property Listings</h2>
        <p>
          Basic property listings submitted by property owners and dealers are completely free. No listing charge or registration fee is incurred.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">2. Packers & Movers Token Advances</h2>
        <p>
          If a booking deposit or token advance is paid for scheduling a moving truck, full refunds are eligible if cancellation is requested at least 48 hours prior to the scheduled pickup time.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">3. Furniture Rental Security Deposits</h2>
        <p>
          Refundable security deposits for rented furniture are processed back to the original bank account within 7 business days following pickup inspection at the end of the rental tenure.
        </p>

        <h2 className="text-base font-bold text-[#1B2A4A]">4. Claim Assistance</h2>
        <p>
          To request refund assistance or address an account issue, email <b>{BRAND.email}</b> or call <b>{BRAND.phone}</b>.
        </p>
      </div>
    </div>
  );
}
