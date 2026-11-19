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
  // Initialize with localStorage directly to avoid cascading renders
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('rw_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { user } = useAuth();
  const supabase = createClient();

  // When user logs in with Supabase, fetch their remote wishlist & merge local items
  useEffect(() => {
    if (!user || !supabase) return;

    let isMounted = true;

    const syncWishlist = async () => {
      try {
        const { data: remoteData, error } = await supabase
          .from('wishlists')
          .select('property_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user wishlist:', error);
          return;
        }

        const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
        const remoteIds = remoteData ? remoteData.map((item) => item.property_id) : [];
        const localItems = JSON.parse(localStorage.getItem('rw_wishlist') || '[]') as string[];
        const itemsToInsert = localItems.filter((id) => !remoteIds.includes(id) && isUuid(id));

        if (itemsToInsert.length > 0) {
          const insertPayload = itemsToInsert.map((property_id) => ({
            user_id: user.id,
            property_id,
          }));
          await supabase.from('wishlists').upsert(insertPayload, { onConflict: 'user_id,property_id' });
        }

        const merged = Array.from(new Set([...remoteIds, ...localItems]));
        if (isMounted) {
          setWishlistIds(merged);
        }
        localStorage.setItem('rw_wishlist', JSON.stringify(merged));
      } catch (err) {
        console.error('Failed to sync wishlist with Supabase:', err);
      }
    };

    void syncWishlist();

    return () => {
      isMounted = false;
    };
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

    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    if (user && supabase && isUuid(propertyId)) {
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
