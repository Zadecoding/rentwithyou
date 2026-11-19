import React from 'react';
import ListingView from '@/components/ListingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Shops, Offices & Warehouses | Rent With You',
  description:
    'High-street retail shops, furnished IT office spaces, and Grade-A logistics warehouses in Gurgaon.',
};

export default function CommercialPage() {
  return (
    <ListingView
      category="commercial"
      pageTitle="Commercial Real Estate"
      pageSubtitle="Retail shops, corporate offices, and logistics warehouses for lease and sale"
    />
  );
}
