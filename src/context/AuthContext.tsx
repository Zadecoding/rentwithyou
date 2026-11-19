'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BRAND, isAdminEmail } from '@/lib/constants';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  demoLoginAsAdmin: () => void;
  demoLoginAsUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      const savedUser = localStorage.getItem('rw_demo_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
      return;
    }

    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isAdmin = isAdminEmail(user?.email);

  const signInWithEmail = async (email: string, password?: string) => {
    if (!supabase) {
      const mockUser = {
        id: 'usr-' + Date.now(),
        email,
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('rw_demo_user', JSON.stringify(mockUser));
      return { error: null };
    }

    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      return { error: error ? new Error(error.message) : null };
    }
  };

  const signUpWithEmail = async (email: string, password?: string) => {
    if (!supabase) {
      const mockUser = {
        id: 'usr-' + Date.now(),
        email,
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('rw_demo_user', JSON.stringify(mockUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: password || 'RentWithYou2026!',
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem('rw_demo_user');
  };

  const demoLoginAsAdmin = () => {
    const adminUser = {
      id: 'admin-001',
      email: BRAND.adminEmail,
      app_metadata: { role: 'admin' },
      user_metadata: { full_name: 'Admin Manager' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;
    setUser(adminUser);
    localStorage.setItem('rw_demo_user', JSON.stringify(adminUser));
  };

  const demoLoginAsUser = () => {
    const normalUser = {
      id: 'user-001',
      email: 'tenant.gurgaon@gmail.com',
      app_metadata: {},
      user_metadata: { full_name: 'Rohit Verma' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as unknown as User;
    setUser(normalUser);
    localStorage.setItem('rw_demo_user', JSON.stringify(normalUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        demoLoginAsAdmin,
        demoLoginAsUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
