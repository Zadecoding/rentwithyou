import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Website Sitemap | Rent With You',
};

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Navigation',
      links: [
        { label: 'Home Page', href: '/' },
        { label: 'For Owner & Developer', href: '/list-your-property' },
        { label: 'Rent Properties', href: '/rent' },
        { label: 'Buy Homes & Plots', href: '/buy' },
        { label: 'Commercial Real Estate', href: '/commercial' },
        { label: 'About Rent With You', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'User & Admin',
      links: [
        { label: 'Profile & Login', href: '/profile' },
        { label: 'Saved Wishlist', href: '/wishlist' },
        { label: 'Admin Dashboard (Restricted)', href: '/admin' },
      ],
    },
    {
      title: 'Rent by City',
      links: [
        { label: 'Rent in Gurgaon', href: '/rent?city=Gurgaon' },
        { label: 'Rent in Delhi', href: '/rent?city=Delhi' },
        { label: 'Rent in Noida', href: '/rent?city=Noida' },
        { label: 'Rent in Faridabad', href: '/rent?city=Faridabad' },
        { label: 'Rent in Ghaziabad', href: '/rent?city=Ghaziabad' },
      ],
    },
    {
      title: 'Information & Legal',
      links: [
        { label: 'FAQs', href: '/faqs' },
        { label: 'Blogs & Guides', href: '/blogs' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Refund Policy', href: '/refund-policy' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-12">
      <h1 className="text-3xl font-black text-[#1B2A4A] mb-2">Website Sitemap</h1>
      <p className="text-sm text-gray-500 mb-8">
        Full directory of all pages, categories, and resources on Rent With You.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((sec, i) => (
          <div key={i} className="bg-[#FAF8F5] p-6 rounded-3xl border border-gray-200">
            <h2 className="text-base font-bold text-[#1B2A4A] mb-4 pb-2 border-b border-gray-200">
              {sec.title}
            </h2>
            <ul className="space-y-2.5 text-xs text-gray-700">
              {sec.links.map((l, j) => (
                <li key={j}>
                  <Link href={l.href} className="hover:text-[#E59A38] transition font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
