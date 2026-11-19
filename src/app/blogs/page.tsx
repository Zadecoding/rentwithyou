import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Real Estate Blog & Gurgaon City Guides | Rent With You',
};

export default function BlogsPage() {
  const articles = [
    {
      title: 'Top 5 Sectors to Rent a 2 BHK in Gurgaon for Tech Professionals (2026)',
      date: 'November 15, 2026',
      readTime: '4 min read',
      excerpt: 'Explore Sector 57, Sector 48, DLF Phase 4, and Golf Course Extension Road for seamless metro access and high-amenity societies.',
      category: 'Rentals Guide',
    },
    {
      title: 'Dwarka Expressway vs Golf Course Extension: Where Should You Buy in 2026?',
      date: 'November 02, 2026',
      readTime: '6 min read',
      excerpt: 'An in-depth capital appreciation analysis comparing upcoming high-rises on the new expressway against ready luxury floors on Golf Course Extension.',
      category: 'Buying Guide',
    },
    {
      title: 'The Ultimate Moving Checklist: Stress-Free Relocation in Delhi NCR',
      date: 'October 24, 2026',
      readTime: '5 min read',
      excerpt: 'From booking verified packers and movers to disconnecting utilities and setting up high-speed broadband on Day 1.',
      category: 'Moving & Living',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-[#1B2A4A] mb-2">Real Estate Insights & City Guides</h1>
      <p className="text-sm text-gray-500 mb-8">
        Expert property tips, sector price trends, and tenancy guides across Gurgaon and Delhi NCR.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#E59A38] uppercase">
                {art.category}
              </span>
              <h3 className="text-base font-bold text-[#1B2A4A] mt-3 leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 mt-4 flex justify-between">
              <span>{art.date}</span>
              <span>{art.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
