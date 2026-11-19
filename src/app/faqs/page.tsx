import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQs) | Rent With You',
};

export default function FaqsPage() {
  const faqs = [
    {
      q: 'How does Rent With You verify property listings?',
      a: 'Our property desk directly reviews ownership records, photographs, and contact information before any listing goes live. Verified badges are awarded to properties where photos and pricing have been checked with the owner.',
    },
    {
      q: 'Is there any brokerage charged to property owners?',
      a: 'No! Property owners can list their residential and commercial properties completely free of cost with zero upfront listing fees.',
    },
    {
      q: 'How do Packers & Movers quotes work?',
      a: 'When you submit a quote request on our Packers & Movers page or modal, our relocation team reviews the pickup/drop sectors and household inventory to give you the most competitive, all-inclusive quote with verified transit insurance.',
    },
    {
      q: 'Can I rent furniture along with my flat?',
      a: 'Yes! Rent With You offers comprehensive furniture packages for 1 BHK, 2 BHK, and master bedroom setups with doorstep delivery, free assembly, and flexible 3-month to 24-month tenures.',
    },
    {
      q: 'How do I edit or delete my listing?',
      a: 'Simply login to your profile at /profile with your registered email to view, edit, or delete your submitted listings anytime.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-[#1B2A4A] mb-2">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-500 mb-8">
        Everything you need to know about renting, buying, and moving with Rent With You.
      </p>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200">
            <h3 className="text-base font-bold text-[#1B2A4A]">{f.q}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 bg-white rounded-3xl border border-gray-200">
        <h4 className="text-base font-bold text-gray-800">Still have questions?</h4>
        <p className="text-xs text-gray-500 mt-1">Our customer support team is always ready to assist.</p>
        <Link
          href="/contact"
          className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
