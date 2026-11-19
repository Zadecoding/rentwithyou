'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';

interface WishlistContextType {
  wishlistIds: string[];
  isWishlisted: (propertyId: string) => boolean;
  toggleWishlist: (propertyId: string) => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user } = useAuth();
  const supabase = createClient();

  // Load initial wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rw_wishlist');
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading wishlist from localStorage:', e);
    }
  }, []);

  // When user logs in with Supabase, fetch their remote wishlist & merge local items
  useEffect(() => {
    if (!user || !supabase) return;

    const syncWishlist = async () => {
      try {
        // Fetch from Supabase
        const { data: remoteData, error } = await supabase
          .from('wishlists')
          .select('property_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user wishlist:', error);
          return;
        }

        const remoteIds = remoteData ? remoteData.map((item) => item.property_id) : [];

        // Check if there are local guest items to merge
        const localItems = JSON.parse(localStorage.getItem('rw_wishlist') || '[]') as string[];
        const itemsToInsert = localItems.filter((id) => !remoteIds.includes(id));

        if (itemsToInsert.length > 0) {
          const insertPayload = itemsToInsert.map((property_id) => ({
            user_id: user.id,
            property_id,
          }));
          await supabase.from('wishlists').upsert(insertPayload, { onConflict: 'user_id,property_id' });
        }

        const merged = Array.from(new Set([...remoteIds, ...localItems]));
        setWishlistIds(merged);
        localStorage.setItem('rw_wishlist', JSON.stringify(merged));
      } catch (err) {
        console.error('Failed to sync wishlist with Supabase:', err);
      }
    };

    syncWishlist();
  }, [user, supabase]);

  const isWishlisted = (propertyId: string) => {
    return wishlistIds.includes(propertyId);
  };

  const toggleWishlist = async (propertyId: string) => {
    const exists = wishlistIds.includes(propertyId);
    const updated = exists
      ? wishlistIds.filter((id) => id !== propertyId)
      : [...wishlistIds, propertyId];

    setWishlistIds(updated);
    localStorage.setItem('rw_wishlist', JSON.stringify(updated));

    // If logged in to Supabase, update database
    if (user && supabase) {
      try {
        if (exists) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('property_id', propertyId);
        } else {
          await supabase
            .from('wishlists')
            .insert({ user_id: user.id, property_id: propertyId });
        }
      } catch (err) {
        console.error('Failed to update remote wishlist:', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
