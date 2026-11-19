import React from 'react';
import ListingView from '@/components/ListingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Homes & New Projects for Sale in Gurgaon | Rent With You',
  description:
    'Explore new launches, ready-to-move apartments, luxury villas, and residential plots to buy in Gurgaon & NCR.',
};

export default function BuyPage() {
  return (
    <ListingView
      category="buy"
      pageTitle="Buy Properties & New Projects"
      pageSubtitle="New launches, ready-to-move homes, luxury villas and residential plots"
    />
  );
}
