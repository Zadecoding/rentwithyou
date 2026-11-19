import React from 'react';
import ListingView from '@/components/ListingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Properties in Gurgaon & NCR | Rent With You',
  description:
    'Browse flats, apartments, independent floors and rooms for rent from owners and verified dealers in Gurgaon.',
};

export default function RentPage() {
  return (
    <ListingView
      category="rent"
      pageTitle="Rental Properties"
      pageSubtitle="Explore flats, independent floors, studio rooms and builder floors for rent in Gurgaon & NCR"
    />
  );
}
